import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

const VIEWPORT_PADDING = 16;
const POPOVER_GAP = 8;

export function usePickerPopoverPosition(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>,
) {
  const [style, setStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!open) {
      setStyle(undefined);
      return;
    }

    const update = () => {
      const anchor = anchorRef.current;
      const popup = popupRef.current;
      if (!anchor || !popup) return;

      const anchorRect = anchor.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();

      // Anchor strictly to the input Container. Label / Caption / Error belong to
      // the outer field and must never affect the popover origin.
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + POPOVER_GAP;
      if (
        top + popupRect.height > viewportHeight - VIEWPORT_PADDING
        && anchorRect.top - POPOVER_GAP - popupRect.height >= VIEWPORT_PADDING
      ) {
        top = anchorRect.top - POPOVER_GAP - popupRect.height;
      }

      const maxLeft = Math.max(
        VIEWPORT_PADDING,
        viewportWidth - popupRect.width - VIEWPORT_PADDING,
      );
      const left = Math.min(Math.max(anchorRect.left, VIEWPORT_PADDING), maxLeft);

      setStyle({ top, left });
    };

    update();
    const frame = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, popupRef]);

  return style;
}
