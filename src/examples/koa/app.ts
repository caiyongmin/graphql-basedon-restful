import Koa from 'koa';
import { ApolloCore } from './../../core/index';
import path from 'path';

const server = ApolloCore({
  schemaDir: path.join(__dirname, './schema'),
});
const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
