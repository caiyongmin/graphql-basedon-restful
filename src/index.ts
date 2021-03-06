import { ApolloServer } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema, addMockFunctionsToSchema, IMocks } from 'graphql-tools';
import { RestDirective } from './directives';
import { dateScalarType } from './scalarTypes';
import { createRestLoader } from './shared/directives';

export function createApolloServer(config: {
  schemaDir: string;
  endpointMap: { [key: string]: string };
  mocks: boolean | IMocks;
}) {
  const { schemaDir, endpointMap, mocks } = config;
  const typesArray = fileLoader(schemaDir, { recursive: true });
  const typeDefs = mergeTypes(typesArray, { all: true });
  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      rest: RestDirective
    },
  });

  if (mocks) {
    addMockFunctionsToSchema({
      schema,
      mocks: typeof mocks === 'boolean' ? {} : mocks,
      preserveResolvers: true,
    });
  }

  return new ApolloServer({
    schema,
    context: () => ({
      endpointMap,
      // TODO: permission verification will be added
      restLoader: createRestLoader(),
    }),
    resolvers: {
      Date: dateScalarType,
    },
  });
};
