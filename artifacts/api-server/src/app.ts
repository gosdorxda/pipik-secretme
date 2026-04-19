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

export default app;
