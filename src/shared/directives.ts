import {
  get as _get,
  set as _set,
  lowerCase as _lowerCase,
} from 'lodash';
import { isArrayPathString, parseArrayPathString } from './parse';
import axios, { Method, AxiosPromise } from 'axios';
import DataLoader, { CacheMap } from 'dataloader';

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

export type RestLoaderParams = {
  method: Method;
  url: string;
  params: { [key: string]: any };
  data: { [key: string]: any };
};

export function createRestLoader(options?: {
  cache?: boolean;
  cacheKeyFn?: (key: any) => any;
  cacheMap?: CacheMap<any, Promise<any>>,
}) {
  options = options || {};
  const cache = options.cache;
  const defaultCacheKeyFn = (key: RestLoaderParams) => key.url;
  const cacheKeyFn = options.cacheKeyFn || defaultCacheKeyFn;
  const cacheMap = options.cacheMap;

  const restDataLoaderFunction = async (keys: RestLoaderParams[]) => {
    try {
      const values = await Promise.all(keys.map(key => {
        return axios(key);
      }));
      return values;
    }
    catch (err) {
      return err;
    }
  }

  const restDataLoader = new DataLoader(restDataLoaderFunction, {
    cache,
    cacheKeyFn,
    cacheMap,
  });

  const restLoader = async (loaderParams: RestLoaderParams) => {
    const { method } = loaderParams;

    // only the 'get' request method is processed
    if (_lowerCase(method) === 'get') {
      return restDataLoader.load(loaderParams);
    }

    return axios(loaderParams);
  }

  return restLoader;
}
