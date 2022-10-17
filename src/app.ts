/* eslint-disable @typescript-eslint/no-explicit-any */
import Koa from 'koa';
import * as swagger from 'swagger2';
import { validate } from 'swagger2-koa';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';
import router from './router';
import path from 'path';
import { koaSwagger } from 'koa2-swagger-ui';

class App extends Koa {
  public servers: Server[];

  constructor() {
    super();
    // bodyparser needs to be loaded first in order to work - in fact, order for all the below is very import!
    this.servers = [];
    this.use(bodyParser());
    this.configureMiddlewares();
    this.configureRoutes();
  }

  configureMiddlewares(): void {
    const readSwagger = swagger.loadDocumentSync(path.join(__dirname, '../swagger.yaml'));
    const swaggerDocument: swagger.Document = readSwagger as swagger.Document;
    this.use(
      koaSwagger({
        routePrefix: '/swagger', // host at /swagger instead of default /docs
        swaggerOptions: {
          url: '../swagger.yaml', // example path to json
        },
      }),
    );
    this.use(validate(swaggerDocument));

    // LoggerService Middleware
    this.use(function* (next) {
      yield next;
    });

    // x - response - time
    this.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set('x-response-time', `${ms}ms`);
    });
  }

  configureRoutes(): void {
    // Bootstrap application router
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  listen(...args: any[]): Server {
    const server = super.listen(...args);
    this.servers.push(server);
    return server;
  }

  terminate(): void {
    for (const server of this.servers) {
      server.close();
    }
  }
}

export default App;
