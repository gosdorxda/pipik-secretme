export function resolveAvatarUrl(
  avatarUrl: string | null | undefined,
): string | null {
  if (!avatarUrl) return null;
  if (avatarUrl.startsWith("/objects/")) {
    return `/api/storage${avatarUrl}`;
  }
  return avatarUrl;
}

export async function fetchAsDataUrl(url: string): Promise<string | null> {
  const tryFetch = async (fetchUrl: string, init?: RequestInit) => {
    const resp = await fetch(fetchUrl, init);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  };

  try {
    const result = await tryFetch(url, { credentials: "omit" });
    if (!result) console.warn("[avatar] fetch not-ok:", url);
    return result;
  } catch (err) {
    console.warn("[avatar] fetch error:", url, err);
    if (!url.startsWith("http")) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
}
