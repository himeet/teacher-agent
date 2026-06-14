import Taro from '@tarojs/taro';
import type { CSSProperties } from 'react';

export const isWeapp = process.env.TARO_ENV === 'weapp';

export function isMobileWebAccess() {
  if (isWeapp) return true;
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;

  const userAgent = navigator.userAgent || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobi/i.test(userAgent);
  const isTabletUserAgent = /iPad|Tablet|PlayBook|Silk|Kindle|Android(?!.*Mobile)/i.test(userAgent);
  const isIPadDesktopMode = /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
  const hasCoarsePointer = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
  const hasMobileViewport = window.innerWidth <= 768;

  return isMobileUserAgent || isTabletUserAgent || isIPadDesktopMode || (hasCoarsePointer && hasMobileViewport);
}

let cachedNavTop: number | null = null;
let cachedRightReserve: number | null = null;

function getMiniNavTop() {
  if (!isWeapp) return 0;
  if (cachedNavTop !== null) return cachedNavTop;

  try {
    const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight || 0;
    const menuButton = Taro.getMenuButtonBoundingClientRect?.();
    cachedNavTop = menuButton?.top
      ? Math.max(statusBarHeight, menuButton.top - 4)
      : statusBarHeight + 8;
  } catch {
    cachedNavTop = 32;
  }

  return cachedNavTop;
}

export function miniSafeTopStyle(basePadding = 0): CSSProperties | undefined {
  if (!isWeapp) return undefined;
  return { paddingTop: `${getMiniNavTop() + basePadding}px` };
}

function getMiniRightReserve() {
  if (!isWeapp) return 0;
  if (cachedRightReserve !== null) return cachedRightReserve;

  try {
    const { windowWidth } = Taro.getSystemInfoSync();
    const menuButton = Taro.getMenuButtonBoundingClientRect?.();
    cachedRightReserve = menuButton?.left
      ? Math.max(96, windowWidth - menuButton.left + 12)
      : 108;
  } catch {
    cachedRightReserve = 108;
  }

  return cachedRightReserve;
}

export function miniSafeHeaderStyle(basePadding = 0): CSSProperties | undefined {
  if (!isWeapp) return undefined;
  return {
    paddingTop: `${getMiniNavTop() + basePadding}px`,
    paddingRight: `${getMiniRightReserve()}px`,
  };
}
