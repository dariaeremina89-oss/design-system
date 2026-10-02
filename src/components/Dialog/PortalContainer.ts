import { createContext } from 'react';
/** Keeps floating controls inside the native modal top layer. */
export const PortalContainer = createContext<HTMLElement | null>(null);
