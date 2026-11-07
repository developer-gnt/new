import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalPaddingRight = '';

export function lockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (lockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount++;
}

export function unlockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }
}

/**
 * React hook to lock background scrolling when a modal, drawer, or dialog is open.
 * Safely handles nested/stacked modals using reference counting.
 *
 * @param locked Whether the body scroll should be locked (typically modal's `isOpen` or `visible` flag)
 */
export function useLockBodyScroll(locked: boolean = true) {
  useEffect(() => {
    if (!locked) return;

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [locked]);
}

export default useLockBodyScroll;

