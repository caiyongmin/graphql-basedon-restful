import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Description of date scalar type',
  serialize(value: number) {
    return new Date(value);
  },
  parseValue(value: Date) {
    return value.getTime();
  },
  parseLiteral(ast: { [key: string]: any }) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
});
