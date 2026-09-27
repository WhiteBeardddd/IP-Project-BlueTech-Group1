"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, errorMessage } from "./api";

// `missing` means the API answered 404: the endpoint isn't built yet, so screens
// show their normal empty state instead of an error.
type State<T> = { data: T | null; error: string; missing: boolean; loading: boolean };

// Fetches `path` on mount. `reload` refetches while keeping the current data on screen.
export function useApi<T>(path: string) {
  const [state, setState] = useState<State<T>>({ data: null, error: "", missing: false, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get<T>(path)
      .then((data) => active && setState({ data, error: "", missing: false, loading: false }))
      .catch((err) => {
        if (!active) return;
        const missing = err instanceof ApiError && err.status === 404;
        setState({ data: null, error: missing ? "" : errorMessage(err), missing, loading: false });
      });
    return () => {
      active = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, reload };
}
