const SANDBOX_FALLBACK = 'https://test.catasto.openapi.it';
let warnedMissingBaseUrl = false;

export function getCatastoBaseUrl(): string {
  const raw = process.env.OPENAPI_CATASTO_BASE_URL;
  if (!raw) {
    if (!warnedMissingBaseUrl) {
      console.warn(
        `[openapi] OPENAPI_CATASTO_BASE_URL not set — falling back to sandbox ${SANDBOX_FALLBACK}`
      );
      warnedMissingBaseUrl = true;
    }
    return SANDBOX_FALLBACK;
  }
  return raw.replace(/\/+$/, '');
}

export function getCatastoToken(): string | null {
  return process.env.OPENAPI_TOKEN ?? null;
}
