"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(fetcher: () => Promise<T>): UseApiState<T> {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({
    data: null,
    loading: true,
    error: null,
  });
  const [trigger, setTrigger] = useState(0);
  const isMounted = useRef(true);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    isMounted.current = true;

    fetcher()
      .then((result) => {
        if (isMounted.current) {
          setState({ data: result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (isMounted.current) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "An error occurred",
          });
        }
      });

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return { data: state.data, loading: state.loading, error: state.error, refetch };
}
