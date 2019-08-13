import Koa from 'koa';
import { createApolloServer } from './../../core/index';
import path from 'path';
import { endpointMap } from './config';

const server = createApolloServer({
  schemaDir: path.join(__dirname, './schema'),
  endpointMap,
});
const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
