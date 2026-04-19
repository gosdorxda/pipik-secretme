export function resolveAvatarUrl(
  avatarUrl: string | null | undefined,
): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("/objects/")) {
    return `/api/storage${avatarUrl}`;
  }
  return avatarUrl;
}
