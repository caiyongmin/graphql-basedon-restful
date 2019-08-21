import {
  startsWith as _startsWith,
  endsWith as _endsWith,
} from 'lodash';

/**
 * judge string is array path string
 * like: "['detail', 'height', 'lower.part']"
 * @param str array path string
 */
export function isArrayPathString(str: string) {
  try {
    if (_startsWith(str, '[') && _endsWith(str, ']')) {
      (new Function(`return ${str}`))();
      return true;
    }
    return false;
  }
  catch (_) {
    return false;
  }
}

/**
 * parse array path string, return array object
 * like: "['detail', 'height', 'lower.part']"
 * will get: ['detail', 'height', 'lower.part']
 * @param str array path string
 */
export function parseArrayPathString(pathString: string) {
  if (typeof pathString !== 'string' || !pathString) {
    return pathString;
  }

  if (isArrayPathString(pathString)) {
    return (new Function(`return ${pathString}`))();
  }

  return pathString;
}
