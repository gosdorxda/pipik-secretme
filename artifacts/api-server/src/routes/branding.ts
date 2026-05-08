import { Router } from "express";
import path from "path";
import fs from "fs";

const router = Router();

export const BRANDING_DIR = path.resolve(
  process.env.DATA_DIR ?? path.join(process.cwd(), "data"),
  "branding",
);

router.get("/branding/:file", (req, res) => {
  const fileName = path.basename(req.params.file);
  const filePath = path.join(BRANDING_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=86400",
  );
  res.sendFile(filePath);
});

export default router;
