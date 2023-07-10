/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';
import { config as dotenv } from 'dotenv';
import { type IConfig } from './interfaces';

// Load .env file into process.env if it exists. This is convenient for running locally.
dotenv({
  path: path.resolve(__dirname, '../.env'),
});

const config: IConfig = {
  logstashHost: process.env.LOGSTASH_HOST as string,
  logstashPort: parseInt(process.env.LOGSTASH_PORT!, 10),
  functionName: process.env.FUNCTION_NAME as string,
  nodeEnv: process.env.NODE_ENV as string,
  restPort: parseInt(process.env.REST_PORT!, 10) || 3000,
  dataPreparationUrl: process.env.DATA_PREPARATION_URL as string,
  dataPreparationUsername: process.env.DATA_PREPARATION_USERNAME as string,
  dataPreparationPassword: process.env.DATA_PREPARATION_PASSWORD as string,
  apmLogging: process.env.APM_LOGGING === 'true',
  apmSecretToken: process.env.APM_SECRET_TOKEN as string,
  apmURL: process.env.APM_URL as string,
  maxCPU: parseInt(process.env.MAX_CPU!, 10) || Number.MAX_SAFE_INTEGER,
};

export { config };
