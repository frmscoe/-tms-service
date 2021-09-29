/* eslint-disable no-console */
import { LoggerService } from './utils';
import App from './app';
import { config } from './config';
import apm from 'elastic-apm-node';

if (config.apmLogging) {
  apm.start({
    serviceName: config.functionName,
    secretToken: config.apmSecretToken,
    serverUrl: config.apmURL,
    usePathAsTransactionName: true,
    active: config.apmLogging,
  });
}

export const runServer = (): void => {
  /**
   * KOA Rest Server
   */
  const app = new App();

  app.listen(config.restport, () => {
    LoggerService.log(`API restServer listening on PORT ${config.restport}`);
  });
};

process.on('uncaughtException', (err) => {
  LoggerService.error(`process on uncaughtException error: ${err}`);
});

process.on('unhandledRejection', (err) => {
  LoggerService.error(`process on unhandledRejection error: ${err}`);
});

try {
  runServer();
} catch (err) {
  LoggerService.error('Error while starting gRPC server', err);
}
