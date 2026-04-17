import type { Request, Response, NextFunction } from "express";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!ADMIN_SECRET) {
    res.status(503).json({ error: "Admin access not configured" });
    return;
  }
  const secret = req.headers["x-admin-secret"];
  if (!secret || secret !== ADMIN_SECRET) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};
