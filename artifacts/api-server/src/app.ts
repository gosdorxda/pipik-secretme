import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import { ipBanMiddleware } from "./middlewares/ipBan";
import router from "./routes";
import { logger } from "./lib/logger";
import { pushLog } from "./lib/logBuffer";
import { db, usersTable, messagesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { buildProfileHtml } from "./lib/profileHtml";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);
app.use(ipBanMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    pushLog({
      ts: Date.now(),
      method: req.method,
      url: (req.originalUrl ?? req.url ?? "").split("?")[0],
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
});

app.use("/api", router);

app.get(/^\/@([a-zA-Z0-9_]{3,32})$/, async (req, res) => {
  const username = (req.params as Record<string, string>)[0];
  if (!username) {
    res.status(404).send("Not found");
    return;
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username.toLowerCase()),
      columns: { id: true, username: true, displayName: true, bio: true },
    });
    if (!user) {
      res.redirect("/");
      return;
    }
    const [{ msgCount }] = await db
      .select({ msgCount: count() })
      .from(messagesTable)
      .where(eq(messagesTable.recipientId, user.id));

    const proto =
      (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
    const host =
      (req.headers["x-forwarded-host"] as string | undefined) ??
      (req.headers["host"] as string | undefined) ??
      "vooi.lol";
    const siteBaseUrl = `${proto}://${host}`;

    const html = buildProfileHtml({
      username: user.username,
      displayName: user.displayName ?? user.username,
      bio: user.bio,
      messageCount: Number(msgCount),
      siteBaseUrl,
    });
    res.set("Content-Type", "text/html; charset=utf-8");
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.send(html);
  } catch (err) {
    logger.error({ err }, "Error serving profile page");
    res.status(500).send("Internal server error");
  }
});

export default app;
