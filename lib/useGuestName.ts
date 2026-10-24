"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "diwali-guest-name";
const EVENT = "diwali-guest-name";

/** Guest's name, remembered in this browser and shared by the RSVP, fit and photo forms. */
export function useGuestName() {
  const [name, setNameState] = useState("");

  useEffect(() => {
    try {
      setNameState(localStorage.getItem(KEY) ?? "");
    } catch {
      // storage blocked — the forms still work, they just won't prefill
    }
    const sync = (e: Event) => setNameState((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
  }, []);

  return [name, setName] as const;
}
