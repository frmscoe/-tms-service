export interface IConfig {
  functionName: string;
  dev: string;
  restport: number;
  grpcport: number;
  dataPreparationHost: string;
  dataPreparationPort: number;
  logstashHost: string;
  logstashPort: number;
  apmLogging: boolean;
  apmSecretToken: string;
  apmURL: string;
}
