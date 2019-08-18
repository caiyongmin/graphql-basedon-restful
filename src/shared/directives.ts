import { get as _get, set as _set } from 'lodash';

export function getArgsFromRoot (root: { [key: string]: any }, rootAccessorMap: string) {
  if (!root || !rootAccessorMap) {
    return null;
  }

  const result = {};
  try {
    const arr = rootAccessorMap.replace(/(\s*)/g, '').match(/\{([^\}]*)\}/g);
    arr.forEach((item: string) => {
      const [ rootField, resultField ] = item.replace(/\{|\}/g, '').split(',');
      _set(result, resultField, _get(root, rootField));
    });
    return result;
  }
  catch (_) {
    return {};
  }
}