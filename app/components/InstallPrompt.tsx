"use client";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  // Type for BeforeInstallPromptEvent (not in TS DOM lib)
  type BeforeInstallPromptEvent = Event & {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  };
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Only show on mobile browsers
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For iOS Safari, show custom banner if not in standalone mode
    // iOS Safari: show custom banner if not in standalone mode
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
  // @ts-expect-error: iOS Safari exposes 'standalone' on navigator, not in TS DOM lib
  (window.navigator['standalone'] === true);
    if (isIos && !isInStandaloneMode) {
      setTimeout(() => setShow(true), 0);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => setShow(false));
    }
  };

  if (!show) return null;

  // Show custom banner
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50 border border-emerald-500">
      <span>
        Install this app: Tap <b>Share</b> → <b>Add to Home Screen</b>
      </span>
      {deferredPrompt && (
        <button
          className="ml-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition"
          onClick={handleInstall}
        >
          Install
        </button>
      )}
      <button
        className="ml-2 px-2 py-1 text-slate-400 hover:text-white"
        onClick={() => setShow(false)}
        aria-label="Close install prompt"
      >
        ×
      </button>
    </div>
  );
}
