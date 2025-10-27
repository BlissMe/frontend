import { useEffect, useRef } from "react";

interface Options {
  disableContextMenu?: boolean; // default true
  disableShortcuts?: boolean;   // default true
  enableOnlyInProduction?: boolean; // default true
  optOutHotkey?: { ctrl?: boolean; alt?: boolean; shift?: boolean; key: string }; // default Ctrl+Alt+D
}

export function useDisableDevTools(options: Options = {}) {
  const {
    disableContextMenu = true,
    disableShortcuts = true,
    enableOnlyInProduction = true,
    optOutHotkey = { ctrl: true, alt: true, shift: false, key: "d" },
  } = options;

  const disabledRef = useRef(true);

  useEffect(() => {
    // If we only want this in production and not in dev, check NODE_ENV
    if (enableOnlyInProduction && process.env.NODE_ENV !== "production") {
      disabledRef.current = false;
      return;
    }
    disabledRef.current = true;

    const keydownHandler = (e: KeyboardEvent) => {
      if (!disabledRef.current) return;

      // Opt-out hotkey (toggle off protection): Ctrl+Alt+D by default
      const isOptOut =
        (!!optOutHotkey.ctrl === e.ctrlKey) &&
        (!!optOutHotkey.alt === e.altKey) &&
        (!!optOutHotkey.shift === e.shiftKey) &&
        e.key.toLowerCase() === optOutHotkey.key.toLowerCase();

      if (isOptOut) {
        disabledRef.current = false;
        console.info("DevTools blocking disabled (opt-out hotkey).");
        return;
      }

      // Block keys when disabled
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+U (view-source)
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
        e.stopPropagation();
      }

      // Ctrl+Shift+K (Firefox console) - optional
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const contextMenuHandler = (e: MouseEvent) => {
      if (!disabledRef.current) return;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("keydown", keydownHandler, true);
    if (disableContextMenu) {
      window.addEventListener("contextmenu", contextMenuHandler, true);
    }

    return () => {
      window.removeEventListener("keydown", keydownHandler, true);
      if (disableContextMenu) {
        window.removeEventListener("contextmenu", contextMenuHandler, true);
      }
    };
  }, [disableContextMenu, disableShortcuts, enableOnlyInProduction, optOutHotkey]);
}
