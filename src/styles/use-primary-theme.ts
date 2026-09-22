import { useSyncExternalStore } from 'react';
import { getPrimarySeed, getColorMode, subscribePrimaryTheme } from './primary-theme-store';
export const usePrimarySeed=()=>useSyncExternalStore(subscribePrimaryTheme,getPrimarySeed,()=>null);

export const useColorMode=()=>useSyncExternalStore(subscribePrimaryTheme,getColorMode,()=>'light' as const);
