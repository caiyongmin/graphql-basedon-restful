import {
  get as _get,
  set as _set,
} from 'lodash';
import { isArrayPathString, parseArrayPathString } from './parse';

/**
 * get args data from parent data by analysis parameter name mappings
 * see this `test/shared/directives.test.ts` file for use cases
 * more powerful supports will be provided coming soon
 * @param parent parent data
 * @param parentAccessorMap parameter name mappings, separate with semicolon
 */
export function getArgsFromParent (parent: { [key: string]: any }, parentAccessorMap: string) {
  if (!parent || !parentAccessorMap) {
    return null;
  }

  const result = {};
  try {
    const arr = parentAccessorMap
      .replace(/(\s*)/g, '')  // remove space characters
      .replace(/^\{|\}$/g, '')  // remove the brackets before and after
      .split(';');  // separate each set of parameters
    arr.forEach((item: string) => {
      if (item) {
        let [ parentField, resultField ] = item.split(':');
        // if parentField is array path string
        if (isArrayPathString(parentField)) {
          parentField = parseArrayPathString(parentField);
        }
        // if resultField is array path string
        if (isArrayPathString(resultField)) {
          resultField = parseArrayPathString(resultField);
        }
        const resultValue = _get(parent, parentField);
        _set(result, resultField, resultValue);
      }
    });
    return result;
  }
  catch (_) {
    return result;
  }
}