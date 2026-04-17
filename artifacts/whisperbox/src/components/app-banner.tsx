import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { useAppConfig } from "@/hooks/use-app-config";

type NotificationType = "info" | "warning" | "success" | "error";

function getDismissKey(message: string): string {
  return `wb_banner_dismissed_${message.slice(0, 80)}`;
}

const TYPE_STYLES: Record<NotificationType, string> = {
  info:    "bg-primary text-primary-foreground",
  warning: "bg-amber-500 text-white",
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
};

const CLOSE_STYLES: Record<NotificationType, string> = {
  info:    "hover:bg-primary-foreground/20",
  warning: "hover:bg-white/20",
  success: "hover:bg-white/20",
  error:   "hover:bg-white/20",
};

export function AppBanner() {
  const { data } = useAppConfig();
  const [dismissed, setDismissed] = useState(false);

  const notification = data?.notification;

  useEffect(() => {
    if (!notification?.message) return;
    const key = getDismissKey(notification.message);
    if (sessionStorage.getItem(key) === "1") {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, [notification?.message]);

  if (!notification || dismissed) return null;

  const type = (notification.type as NotificationType) || "info";

  const handleDismiss = () => {
    sessionStorage.setItem(getDismissKey(notification.message), "1");
    setDismissed(true);
  };

  return (
    <div className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm ${TYPE_STYLES[type]}`}>
      <Megaphone className="w-4 h-4 shrink-0 opacity-90" />
      <p className="flex-1 text-center leading-snug font-medium">{notification.message}</p>
      <button
        onClick={handleDismiss}
        className={`shrink-0 rounded-full p-0.5 transition-colors ${CLOSE_STYLES[type]}`}
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
