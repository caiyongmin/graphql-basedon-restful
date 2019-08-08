import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const dbPath = path.join(__dirname, './db.json');
const router = jsonServer.router(dbPath);
const middleware = jsonServer.defaults();
const port = 2001;

server.use(middleware);
server.use(router);
server.use(jsonServer.bodyParser);
server.listen(port, () => {
  console.log(`JSON Server is running: http://127.0.0.1:${port}`);
});
