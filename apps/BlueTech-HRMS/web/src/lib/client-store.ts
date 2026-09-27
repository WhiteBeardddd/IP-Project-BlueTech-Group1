"use client";

import { useSyncExternalStore } from "react";

// Tiny localStorage-backed store. Reads are hydration-safe: the server
// snapshot is always null, so the first client render matches the HTML.

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The UI still works for this session.
  }
  listeners.forEach((listener) => listener());
}

export function useStored(key: string) {
  return useSyncExternalStore(subscribe, () => read(key), () => null);
}

const noSubscribe = () => () => {};

// A value that only exists in the browser (e.g. today's date), empty during SSR.
export function useClientValue(get: () => string) {
  return useSyncExternalStore(noSubscribe, get, () => "");
}

export const ADMIN_KEY = "hrms-admin";
export const SIDEBAR_KEY = "hrms-sidebar-collapsed";
