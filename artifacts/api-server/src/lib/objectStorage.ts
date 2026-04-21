import { Storage, File } from "@google-cloud/storage";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

// ── Driver detection ──────────────────────────────────────────────────────────
// Set STORAGE_DRIVER=s3 in .env to use S3-compatible storage (Cloudflare R2,
// MinIO, AWS S3, etc.). Default is "replit" (uses Replit Object Storage sidecar).

function isS3Mode(): boolean {
  return (process.env.STORAGE_DRIVER || "replit") === "s3";
}

// ── Replit GCS client (sidecar) ───────────────────────────────────────────────
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

// ── S3 client (lazy) ──────────────────────────────────────────────────────────
let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3Client) {
    _s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT!,
      region: process.env.S3_REGION || "auto",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      // Required for Cloudflare R2 and other S3-compatible providers
      // that don't support virtual-hosted bucket URLs on the root endpoint.
      forcePathStyle: true,
    });
  }
  return _s3Client;
}

function getS3Bucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET environment variable is not set");
  return bucket;
}

// ── Shared error ──────────────────────────────────────────────────────────────
export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// ── Internal reference type for S3 objects ────────────────────────────────────
interface S3ObjectRef {
  _s3: true;
  key: string;
}

// ── ObjectStorageService ──────────────────────────────────────────────────────
// Single class that works in both Replit (GCS) and S3 modes.
// Switch via STORAGE_DRIVER=s3 environment variable.

export class ObjectStorageService {
  constructor() {}

  // ── Public object search (Replit only) ─────────────────────────────────────

  getPublicObjectSearchPaths(): Array<string> {
    if (isS3Mode()) {
      throw new Error(
        "Public object search paths are not supported in S3 mode. " +
          "Serve public assets directly from your S3-compatible bucket.",
      );
    }
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0),
      ),
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths).",
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    if (isS3Mode()) {
      throw new Error("getPrivateObjectDir is not used in S3 mode");
    }
    let dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var.",
      );
    }
    if (!dir.startsWith("/")) {
      dir = `/${dir}`;
    }
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<File | null> {
    if (isS3Mode()) {
      throw new Error("searchPublicObject is not supported in S3 mode");
    }
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseGcsObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }

  // ── Download / stream ───────────────────────────────────────────────────────

  async downloadObject(file: File | S3ObjectRef): Promise<Response> {
    if (isS3Mode()) {
      return this._downloadFromS3(file as S3ObjectRef);
    }
    return this._downloadFromGCS(file as File);
  }

  private async _downloadFromGCS(file: File): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const aclPolicy = await getObjectAclPolicy(file);
    const isPublic = aclPolicy?.visibility === "public";

    const nodeStream = file.createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      "Content-Type":
        (metadata.contentType as string) || "application/octet-stream",
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=3600`,
    };
    if (metadata.size) {
      headers["Content-Length"] = String(metadata.size);
    }

    return new Response(webStream, { headers });
  }

  private async _downloadFromS3(ref: S3ObjectRef): Promise<Response> {
    const publicUrl = process.env.STORAGE_PUBLIC_URL;

    if (publicUrl) {
      // Proxy content server-side from the public R2/S3 URL.
      // We intentionally avoid returning a redirect to the browser because
      // JavaScript fetch() (used by fetchAsDataUrl for share/QR cards) will
      // follow cross-origin redirects and get blocked by CORS — R2 does not
      // set Access-Control-Allow-Origin on assets.kepoin.me.
      const fileUrl = `${publicUrl.replace(/\/$/, "")}/${ref.key}`;
      const upstream = await fetch(fileUrl, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!upstream.ok) throw new ObjectNotFoundError();
      return upstream;
    }

    // Fallback: proxy the file through the API server via S3 SDK.
    const result = await getS3Client().send(
      new GetObjectCommand({
        Bucket: getS3Bucket(),
        Key: ref.key,
      }),
    );

    const nodeStream = result.Body as Readable;
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Type": result.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  }

  // ── Upload URL generation ───────────────────────────────────────────────────

  async getObjectEntityUploadURL(): Promise<string> {
    if (isS3Mode()) {
      return this._getS3UploadURL();
    }
    return this._getGCSUploadURL();
  }

  private async _getGCSUploadURL(): Promise<string> {
    const privateObjectDir = this.getPrivateObjectDir();
    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseGcsObjectPath(fullPath);
    return signGCSObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    });
  }

  private async _getS3UploadURL(): Promise<string> {
    const key = `uploads/${randomUUID()}`;
    const command = new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    });
    return getSignedUrl(getS3Client(), command, { expiresIn: 900 });
  }

  // ── File retrieval ──────────────────────────────────────────────────────────

  async getObjectEntityFile(objectPath: string): Promise<File | S3ObjectRef> {
    if (isS3Mode()) {
      return this._getS3ObjectRef(objectPath);
    }
    return this._getGCSObjectFile(objectPath);
  }

  private _getS3ObjectRef(objectPath: string): S3ObjectRef {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const key = objectPath.slice("/objects/".length);
    if (!key) throw new ObjectNotFoundError();
    return { _s3: true, key };
  }

  private async _getGCSObjectFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) throw new ObjectNotFoundError();

    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) entityDir = `${entityDir}/`;

    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseGcsObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) throw new ObjectNotFoundError();
    return objectFile;
  }

  // ── Path normalization ──────────────────────────────────────────────────────

  normalizeObjectEntityPath(rawPath: string): string {
    if (isS3Mode()) {
      return this._normalizeS3Path(rawPath);
    }
    return this._normalizeGCSPath(rawPath);
  }

  private _normalizeGCSPath(rawPath: string): string {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;

    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) objectEntityDir = `${objectEntityDir}/`;

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }

    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }

  private _normalizeS3Path(rawPath: string): string {
    // rawPath is a presigned S3 URL, e.g.:
    // Path-style: https://<host>/<bucket>/uploads/<uuid>?X-Amz-...
    // Vhost-style: https://<bucket>.<host>/uploads/<uuid>?X-Amz-...
    try {
      const url = new URL(rawPath);
      let pathname = url.pathname; // e.g. "/<bucket>/uploads/<uuid>"

      const bucket = process.env.S3_BUCKET || "";
      if (bucket && pathname.startsWith(`/${bucket}/`)) {
        // Strip the bucket prefix (path-style URL)
        pathname = pathname.slice(`/${bucket}`.length);
      }
      // pathname is now "/uploads/<uuid>"
      return `/objects${pathname}`;
    } catch {
      return rawPath;
    }
  }

  // ── ACL (Replit only — S3 mode uses bucket-level public access) ─────────────

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy,
  ): Promise<string> {
    if (isS3Mode()) {
      // In S3/R2 mode, access control is managed at the bucket level.
      // All uploaded files are publicly readable; write is gated at the API.
      return rawPath;
    }
    const normalizedPath = this._normalizeGCSPath(rawPath);
    if (!normalizedPath.startsWith("/")) return normalizedPath;
    const objectFile = await this._getGCSObjectFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File | S3ObjectRef;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    if (isS3Mode()) {
      // All objects in S3/R2 mode are publicly readable.
      // Write access is controlled at the upload endpoint level.
      return true;
    }
    return canAccessObject({
      userId,
      objectFile: objectFile as File,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseGcsObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) path = `/${path}`;
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  return {
    bucketName: pathParts[1],
    objectName: pathParts.slice(2).join("/"),
  };
}

async function signGCSObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`,
    );
  }
  const data = (await response.json()) as { signed_url: string };
  return data.signed_url;
}
