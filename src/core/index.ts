import { ApolloServer } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import RestDirective from './directives/rest';

export function createApolloServer(params: {
  schemaDir: string;
  endpointMap: { [key: string]: string }
}) {
  const { schemaDir, endpointMap } = params;
  const typesArray = fileLoader(schemaDir, { recursive: true });
  const typeDefs = mergeTypes(typesArray, { all: true });
  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      rest: RestDirective
    },
  });

  return new ApolloServer({
    schema,
    context: ({ req }) => ({
      endpointMap
    }),
  });
};
