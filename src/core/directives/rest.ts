import { GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import axios from 'axios';
import RouteParser from 'route-parser';
import { get as _get } from 'lodash';

export default class RestDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
    const {
      endpoint,
      path,
      method = 'get',
      responseAccessor,
    } = this.args;

    field.resolve = async (_, args, context) => {
      try {
        const { params = {}, body = {}, ...pathArgs } = args;
        const { endpointMap } = context;
        const host = endpointMap[endpoint];

        if (!host) {
          throw new Error('server host is empty, checkout the endpoint and endpointMap config!');
        }

        const url = host + (new RouteParser(path)).reverse(pathArgs);

        console.info('===params, body, pathArgs===', params, body, pathArgs);
        console.info('===url===', url);
        const result = await axios({ method, url, params, data: body });
        const data = result.data;
        if (typeof responseAccessor === 'string' && responseAccessor) {
          // if responseAccessor is string type, and has a valid value
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
