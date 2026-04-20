import fs from "node:fs";
import path from "node:path";

const WORKSPACE_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../..",
);

function readIndexHtml(): string {
  const prodPath = path.join(
    WORKSPACE_ROOT,
    "artifacts/whisperbox/dist/public/index.html",
  );
  const devPath = path.join(WORKSPACE_ROOT, "artifacts/whisperbox/index.html");
  if (fs.existsSync(prodPath)) return fs.readFileSync(prodPath, "utf8");
  return fs.readFileSync(devPath, "utf8");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildProfileHtml(opts: {
  username: string;
  displayName: string;
  bio?: string | null;
  messageCount: number;
  siteBaseUrl: string;
}): string {
  const { username, displayName, bio, messageCount, siteBaseUrl } = opts;

  const profileUrl = `${siteBaseUrl}/@${username}`;
  const imageUrl = `${siteBaseUrl}/api/og/profile/${username}`;
  const title = `${displayName} (@${username}) — kepoin.me`;
  const description =
    bio && bio.trim()
      ? bio.trim()
      : `Kirim pesan anonim ke ${displayName} di kepoin.me. ${messageCount} pesan sudah diterima — giliran kamu sekarang!`;

  const html = readIndexHtml();

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${esc(description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${esc(title)}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${esc(description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
      `$1${esc(profileUrl)}$2`,
    )
    .replace(
      /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
      `$1${esc(imageUrl)}$2`,
    )
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(")/, `$1profile$2`)
    .replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${esc(title)}$2`,
    )
    .replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${esc(description)}$2`,
    )
    .replace(
      /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
      `$1${esc(imageUrl)}$2`,
    );
}
