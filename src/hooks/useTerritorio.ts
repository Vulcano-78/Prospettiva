'use client';

import { useEffect, useState } from 'react';

export type Provincia = {
  provincia: string;
  nome_provincia: string;
  id?: string;
};

export type Comune = {
  comune: string;
  sezioni?: unknown;
  codice_catastale?: string;
};

let provinceCache: Provincia[] | null = null;
let provincePromise: Promise<Provincia[]> | null = null;
const comuniCache = new Map<string, Comune[]>();
const comuniPromises = new Map<string, Promise<Comune[]>>();

function unwrapList<T>(json: unknown, keys: string[]): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === 'object') {
    const obj = json as Record<string, unknown>;
    for (const key of keys) {
      const val = obj[key];
      if (Array.isArray(val)) return val as T[];
    }
    // try .data.{keys}
    const data = obj.data;
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      for (const key of keys) {
        const val = d[key];
        if (Array.isArray(val)) return val as T[];
      }
      if (Array.isArray(data)) return data as T[];
    }
  }
  return [];
}

function fetchProvince(): Promise<Provincia[]> {
  if (provincePromise) return provincePromise;
  provincePromise = fetch('/api/catasto/territorio')
    .then(async (r) => {
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${r.status}`);
      }
      const json = await r.json();
      const list = unwrapList<Provincia>(json, ['province', 'territorio']);
      provinceCache = list;
      return list;
    })
    .catch((err) => {
      provincePromise = null; // allow retry
      throw err;
    });
  return provincePromise;
}

function fetchComuni(provincia: string): Promise<Comune[]> {
  const existing = comuniPromises.get(provincia);
  if (existing) return existing;
  const p = fetch(`/api/catasto/territorio/${provincia}`)
    .then(async (r) => {
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${r.status}`);
      }
      const json = await r.json();
      const list = unwrapList<Comune>(json, ['comuni']);
      comuniCache.set(provincia, list);
      return list;
    })
    .catch((err) => {
      comuniPromises.delete(provincia);
      throw err;
    });
  comuniPromises.set(provincia, p);
  return p;
}

export function useProvince() {
  const [province, setProvince] = useState<Provincia[]>(provinceCache ?? []);
  const [isLoading, setIsLoading] = useState(provinceCache === null);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (provinceCache && retryToken === 0) {
      setProvince(provinceCache);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchProvince()
      .then((list) => {
        if (cancelled) return;
        setProvince(list);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  return {
    province,
    isLoading,
    error,
    retry: () => setRetryToken((t) => t + 1),
  };
}

export function useComuni(provincia: string | null) {
  const initial = provincia ? comuniCache.get(provincia) ?? [] : [];
  const [comuni, setComuni] = useState<Comune[]>(initial);
  const [isLoading, setIsLoading] = useState(
    !!provincia && !comuniCache.has(provincia)
  );
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!provincia) {
      setComuni([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    const cached = comuniCache.get(provincia);
    if (cached && retryToken === 0) {
      setComuni(cached);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchComuni(provincia)
      .then((list) => {
        if (cancelled) return;
        setComuni(list);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [provincia, retryToken]);

  return {
    comuni,
    isLoading,
    error,
    retry: () => setRetryToken((t) => t + 1),
  };
}
