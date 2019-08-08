import { GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import axios from 'axios';

export default class RestDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
    // console.info('this.args', this.args);
    const { endpoint, path } = this.args;

    field.resolve = async () => {
      try {
        const result = await axios.get(endpoint + path);
        // console.info('result', result);
        return result.data;
      } catch (error) {
        return JSON.stringify(error);
      }
    };
  }
}
