/* eslint-disable no-console */
import { LoggerService } from '@frmscoe/frms-coe-lib';
import cluster from 'cluster';
import apm from 'elastic-apm-node';
import os from 'os';
import App from './app';
import { config } from './config';

if (config.apmLogging) {
  apm.start({
    serviceName: config.functionName,
    secretToken: config.apmSecretToken,
    serverUrl: config.apmURL,
    usePathAsTransactionName: true,
    active: config.apmLogging,
    transactionIgnoreUrls: ['/health'],
    disableInstrumentations: ['log4js'],
  });
}

export const loggerService: LoggerService = new LoggerService();
const runServer = async (): Promise<App> => {
  /**
   * KOA Rest Server
   */
  const app = new App();

  app.listen(config.restPort, () => {
    loggerService.log(`API restServer listening on PORT ${config.restPort}`);
  });

  return app;
};

process.on('uncaughtException', (err) => {
  loggerService.error(`process on uncaughtException error: `, err);
});

process.on('unhandledRejection', (err) => {
  loggerService.error(`process on unhandledRejection error: `, err);
});

const numCPUs = os.cpus().length > config.maxCPU ? config.maxCPU + 1 : os.cpus().length + 1;

if (cluster.isMaster && config.maxCPU !== 1) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 1; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid!} died, starting another worker`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server

  if (process.env.NODE_ENV !== 'test')
    (async () => {
      try {
        await runServer();
      } catch (err) {
        loggerService.error(`Error while starting HTTP server on Worker ${process.pid}`, err);
      }
    })();
  console.log(`Worker ${process.pid} started`);
}

export { runServer };
