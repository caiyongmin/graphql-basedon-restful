import { get as _get, set as _set } from 'lodash';

export function getArgsFromParent (parent: { [key: string]: any }, parentAccessorMap: string) {
  if (!parent || !parentAccessorMap) {
    return null;
  }

  const result = {};
  try {
    const arr = parentAccessorMap
      .replace(/(\s*)/g, '')  // 去除其中空字符
      .replace(/^\{|\}$/g, '')  // 去除前后的中括号 { }
      .split(',');  // 分离设置的每个属性
    arr.forEach((item: string) => {
      const [ parentField, resultField ] = item.split(':');
      _set(result, resultField, _get(parent, parentField));
    });
    return result;
  }
  catch (_) {
    return result;
  }
}