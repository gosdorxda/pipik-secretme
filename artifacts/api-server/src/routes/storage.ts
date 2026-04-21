import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "../lib/objectStorage";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * POST /storage/uploads/request-url
 *
 * Authenticated endpoint — requires a valid Clerk session.
 * Request a presigned URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to the returned presigned URL.
 *
 * Server-side guards: image MIME types only, max 5 MB.
 */
router.post(
  "/storage/uploads/request-url",
  requireAuth,
  async (req: Request, res: Response) => {
    const parsed = RequestUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Missing or invalid required fields" });
      return;
    }

    const { name, size, contentType } = parsed.data;

    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      res
        .status(400)
        .json({ error: "Only image files are allowed (JPEG, PNG, GIF, WebP)" });
      return;
    }

    if (size > MAX_UPLOAD_SIZE_BYTES) {
      res.status(400).json({ error: "File size exceeds the 5 MB limit" });
      return;
    }

    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath =
        objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json(
        RequestUploadUrlResponse.parse({
          uploadURL,
          objectPath,
          metadata: { name, size, contentType },
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, "Error generating upload URL");
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  },
);

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 * IMPORTANT: Always provide this endpoint when object storage is set up.
 */
router.get(
  "/storage/public-objects/*filePath",
  async (req: Request, res: Response) => {
    try {
      const raw = req.params.filePath;
      const filePath = Array.isArray(raw) ? raw.join("/") : raw;
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const response = await objectStorageService.downloadObject(file);

      res.status(response.status);
      response.headers.forEach((value, key) => res.setHeader(key, value));

      if (response.body) {
        const nodeStream = Readable.fromWeb(
          response.body as ReadableStream<Uint8Array>,
        );
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      req.log.error({ err: error }, "Error serving public object");
      res.status(500).json({ error: "Failed to serve public object" });
    }
  },
);

/**
 * GET /storage/objects/*
 *
 * Serve object entities (user-uploaded files, e.g. avatars).
 *
 * Access policy: INTENTIONALLY PUBLIC — avatars are shown on public profile pages
 * which do not require authentication. All uploads are gated at the write path
 * (POST /storage/uploads/request-url requires Clerk auth + MIME/size validation),
 * so any file reachable via this route was uploaded by an authenticated user.
 *
 * If non-avatar private uploads are added in the future, add ACL checks here
 * before serving those objects.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile =
      await objectStorageService.getObjectEntityFile(objectPath);

    const response = await objectStorageService.downloadObject(objectFile);

    // If the storage backend returns a redirect (e.g. to a public R2/S3 URL),
    // proxy the content server-side instead of forwarding the redirect to the
    // browser. This prevents CORS failures when JavaScript fetch() follows a
    // cross-origin redirect (e.g. kepoin.me → assets.kepoin.me).
    if (
      (response.status === 301 || response.status === 302) &&
      response.headers.get("location")
    ) {
      const redirectUrl = response.headers.get("location")!;
      const upstream = await fetch(redirectUrl);
      res.status(200);
      res.setHeader(
        "Content-Type",
        upstream.headers.get("content-type") || "application/octet-stream",
      );
      res.setHeader(
        "Cache-Control",
        upstream.headers.get("cache-control") || "public, max-age=31536000",
      );
      if (upstream.body) {
        const nodeStream = Readable.fromWeb(
          upstream.body as ReadableStream<Uint8Array>,
        );
        nodeStream.pipe(res);
      } else {
        res.end();
      }
      return;
    }

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(
        response.body as ReadableStream<Uint8Array>,
      );
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
