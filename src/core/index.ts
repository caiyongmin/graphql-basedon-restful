import { ApolloServer } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { RestDirective } from './directives';
import { dateScalarType } from './scalarTypes';
import 'apollo-cache-control';

export function createApolloServer(config: {
  schemaDir: string;
  endpointMap: { [key: string]: string }
}) {
  const { schemaDir, endpointMap } = config;
  const typesArray = fileLoader(schemaDir, { recursive: true });
  const typeDefs = mergeTypes(typesArray, { all: true });
  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      rest: RestDirective
    },
  });
  addMockFunctionsToSchema({
    schema,
    mocks: {
      Date: () => +new Date(),
      order: () => ({
        id: 1,
        created: +new Date(),
        price: 10.1,
      }),
    },
    preserveResolvers: true,
  });
  const resolverFunctions = {
    Date: dateScalarType,
  };

  return new ApolloServer({
    schema,
    context: ({ req }) => ({
      endpointMap
    }),
    // cacheControl: true,
    resolvers: resolverFunctions,
  });
};
