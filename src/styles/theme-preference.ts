export const PRIMARY_STORAGE_KEY='fdoc-primary-color-v1';
export const MODE_STORAGE_KEY='fdoc-color-mode-v1';
export function readColorMode():'light'|'dark' {
  try { return localStorage.getItem(MODE_STORAGE_KEY)==='dark'?'dark':'light'; } catch { return 'light'; }
}
