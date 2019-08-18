import Koa from 'koa';
import KoaRouter from 'koa-router';
import { koa as voyagerMiddleware } from 'graphql-voyager/middleware';
import path from 'path';
import { createApolloServer } from './../../core/index';
import { endpointMap } from './config';

const router = new KoaRouter();
const app = new Koa();
const server = createApolloServer({
  schemaDir: path.join(__dirname, './schema'),
  endpointMap,
});

router.all('/apidoc', voyagerMiddleware({
  endpointUrl: server.graphqlPath
}));
app.use(router.routes());
app.use(router.allowedMethods());
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
