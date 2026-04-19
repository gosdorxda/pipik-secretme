import type { Request, Response, NextFunction } from "express";
import { getBannedIps } from "../lib/settingsCache";

export const ipBanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const banned = await getBannedIps();
    if (banned.includes(ip)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }
  } catch {
    // fail open
  }
  next();
};
