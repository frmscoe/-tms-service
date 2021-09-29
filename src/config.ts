/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';
import { config as dotenv } from 'dotenv';
import { IConfig } from './interfaces';

// Load .env file into process.env if it exists. This is convenient for running locally.
dotenv({
  path: path.resolve(__dirname, '../.env'),
});

const config: IConfig = {
  functionName: <string>process.env.FUNCTION_NAME,
  nodeEnv: <string>process.env.NODE_ENV,
  restport: parseInt(process.env.REST_PORT!, 10) || 3000,
  grpcport: parseInt(process.env.GRPC_PORT!, 10) || 50051,
  dataPreparationHost: process.env.DATA_PREPARATION_HOST!,
  dataPreparationPort: parseInt(process.env.DATA_PREPARATION_PORT!, 10) || 3000,
  logstashHost: <string>process.env.LOGSTASH_HOST,
  logstashPort: parseInt(process.env.LOGSTASH_PORT!, 10),
  apmLogging: <boolean>(process.env.APM_LOGGING === 'true'),
  apmSecretToken: <string>process.env.APM_SECRET_TOKEN,
  apmURL: <string>process.env.APM_URL,
};

export { config };
