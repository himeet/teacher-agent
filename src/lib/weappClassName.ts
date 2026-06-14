import { isWeapp } from '@/lib/platform';

const SAFE_CLASS_NAME_RE = /^-?[A-Za-z_][A-Za-z0-9_-]*$/;

function toSafeClassName(className: string) {
  if (SAFE_CLASS_NAME_RE.test(className)) return className;

  let safeName = 'twx-';

  for (const char of className) {
    safeName += /[A-Za-z0-9-]/.test(char)
      ? char
      : `_${char.codePointAt(0)?.toString(16) ?? '0'}_`;
  }

  return safeName;
}

export function normalizeWeappClassName(className: unknown) {
  if (!isWeapp || typeof className !== 'string') return className;

  return className
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(toSafeClassName)
    .join(' ');
}
