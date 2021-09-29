export interface IConfig {
  functionName: string;
  nodeEnv: string;
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
