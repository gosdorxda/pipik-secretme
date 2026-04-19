/**
 * Converts a stored object path (e.g. /objects/uploads/{uuid}) to a
 * full API URL that can be served by the storage route.
 * Falls through unchanged for external http(s) URLs and empty values.
 */
export function resolveStorageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("/objects/")) {
    return `/api/storage${path}`;
  }
  return path;
}
