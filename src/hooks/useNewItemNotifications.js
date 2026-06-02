// src/hooks/useNewItemNotifications.js
import { useEffect, useRef, useState } from "react";

export function useNotificationPermission() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      setEnabled(true);
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setEnabled(true);
        }
      });
    }
    // if "denied", do nothing (user must change in browser settings)
  }, []);

  return { enabled };
}

export function useNewItemNotifications({
  items,
  getId,
  getTitle,
  getBody,
  enabled,
}) {
  const prevIdsRef = useRef([]);

  useEffect(() => {
    if (!enabled) return;
    if (!Array.isArray(items)) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!("Notification" in window)) return;

    const currentIds = items.map((item) => getId(item));
    const prevIds = prevIdsRef.current;
    const newIds = currentIds.filter((id) => !prevIds.includes(id));

    const isTabHidden = document.visibilityState === "hidden";

    if (newIds.length > 0 && isTabHidden) {
      newIds.forEach((id) => {
        const item = items.find((it) => getId(it) === id);
        if (!item) return;

        const title = getTitle(item);
        const body = getBody(item);

        new Notification(title, {
          body,
          tag: String(id),
        });
      });
    }

    prevIdsRef.current = currentIds;
  }, [items, enabled, getId, getTitle, getBody]);
}
