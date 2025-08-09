export const APP_STORAGE_VERSION = 1;

export function safeGetJSON(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function migrateStorage() {
  const meta = safeGetJSON('app_meta', { version: 1 });
  if (meta.version < APP_STORAGE_VERSION) {
    const state = safeGetJSON('app_state', {});
    // Perform non-destructive transformations here
    window.localStorage.setItem('app_state', JSON.stringify(state));
    window.localStorage.setItem(
      'app_meta',
      JSON.stringify({ version: APP_STORAGE_VERSION })
    );
  }
}
