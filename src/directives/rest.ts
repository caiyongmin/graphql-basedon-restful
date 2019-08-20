import { GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import axios from 'axios';
import RouteParser from 'route-parser';
import { get as _get, merge as _merge } from 'lodash';
import { getArgsFromParent } from './../shared/directives';

export default class RestDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
    const {
      endpoint,
      path,
      method = 'get',
      responseAccessor,
      parentAccessorMap,
    } = this.args;

    field.resolve = async (parent, args, context) => {
      try {
        const parentArgs = getArgsFromParent(parent, parentAccessorMap);
        const { params = {}, body = {}, ...pathArgs } = _merge({}, parentArgs, args);
        const { endpointMap } = context;
        const host = endpointMap[endpoint];

        if (!host) {
          throw new Error(`
            when endpoint is ${endpoint} and endpointMap is ${endpointMap},
            achieved service host is undefined, please checkout the endpoint and endpointMap config
          `);
        }

        const url = host + (new RouteParser(path)).reverse(pathArgs);
        const result = await axios({ method, url, params, data: body });
        const data = result.data;

        // if responseAccessor is string type, and has a valid value
        if (typeof responseAccessor === 'string' && responseAccessor) {
          return _get(data, responseAccessor);
        }
        return data;
      }
      catch (error) {
        console.info('===error result===', error);
        return JSON.stringify(error);
      }
    };
  }
}
