import { createColorTheme } from './color-theme';
import { DEFAULT_PRIMARY, normalizeHex, type PrimaryTheme, type ColorMode } from './primary-theme';
import { PRIMARY_STORAGE_KEY, MODE_STORAGE_KEY } from './theme-preference';
export { PRIMARY_STORAGE_KEY, MODE_STORAGE_KEY } from './theme-preference';

const changed='fdoc-primary-theme-change';
let current:PrimaryTheme|null=null;
let seed:string|null=null;
let mode:ColorMode='light';
let initialized=false;
export const getPrimarySeed=()=>seed;
export const getColorMode=()=>mode;
export const getPrimaryTheme=()=>current;
export function subscribePrimaryTheme(listener:()=>void) {
  window.addEventListener(changed,listener);
  return ()=>window.removeEventListener(changed,listener);
}
export function applyPrimaryTheme(input:string|null,persist=true,nextMode:ColorMode=mode):PrimaryTheme|null {
  const normalized=input===null?null:normalizeHex(input);
  if(input!==null&&!normalized) throw new Error('Введите HEX из 3 или 6 символов');
  const next=normalized||nextMode==='dark'?createColorTheme(normalized??DEFAULT_PRIMARY,nextMode):null;
  const root=document.documentElement;
  if(current) for(const key of Object.keys(current.variables)) root.style.removeProperty(key);
  if(next) for(const [key,value] of Object.entries(next.variables)) root.style.setProperty(key,value);
  root.toggleAttribute('data-custom-primary',Boolean(normalized));
  root.toggleAttribute('data-custom-theme',Boolean(next));
  root.dataset.colorMode=nextMode;
  root.style.colorScheme=nextMode;
  current=next; seed=normalized; mode=nextMode;
  if(persist) try {
    if(normalized) localStorage.setItem(PRIMARY_STORAGE_KEY,normalized); else localStorage.removeItem(PRIMARY_STORAGE_KEY);
    localStorage.setItem(MODE_STORAGE_KEY,mode);
  } catch { /* Session preview works when storage is unavailable. */ }
  window.dispatchEvent(new Event(changed));
  return next;
}
export const applyColorMode=(next:ColorMode)=>applyPrimaryTheme(seed,true,next);
export function initializePrimaryTheme() {
  if(initialized || typeof window==='undefined') return;
  initialized=true;
  const restore=()=>{
    try {
      const saved=localStorage.getItem(PRIMARY_STORAGE_KEY),savedMode=localStorage.getItem(MODE_STORAGE_KEY);
      applyPrimaryTheme(saved&&normalizeHex(saved)?saved:null,false,savedMode==='dark'?'dark':'light');
    } catch { /* Keep the default theme. */ }
  };
  restore();
  window.addEventListener('storage',event=>{if([PRIMARY_STORAGE_KEY,MODE_STORAGE_KEY,null].includes(event.key)) restore();});
}
