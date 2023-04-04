/* eslint-disable no-console */
import { LoggerService } from './utils/logger';
import App from './app';
import { config } from './config';
import apm from 'elastic-apm-node';
import cluster from 'cluster';
import os from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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

export const runServer = (): void => {
  /**
   * KOA Rest Server
   */
  const app = new App();

  app.listen(config.restPort, () => {
    LoggerService.log(`API restServer listening on PORT ${config.restPort}`);
  });
};

process.on('uncaughtException', (err) => {
  LoggerService.error(`process on uncaughtException error: ${err}`);
});

process.on('unhandledRejection', (err) => {
  LoggerService.error(`process on unhandledRejection error: ${err}`);
});

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died, starting another worker`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  try {
    runServer();
  } catch (err) {
    LoggerService.error(`Error while starting HTTP server on Worker ${process.pid}`, err);
  }
  console.log(`Worker ${process.pid} started`);
}
