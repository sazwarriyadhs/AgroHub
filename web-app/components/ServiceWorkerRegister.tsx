"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");
          console.log("SW registered:", reg.scope);
        } catch (err) {
          console.log("SW failed:", err);
        }
      };

      window.addEventListener("load", registerSW);
    }
  }, []);

  return null;
}