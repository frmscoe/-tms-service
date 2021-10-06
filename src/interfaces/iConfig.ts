export interface IConfig {
  functionName: string;
  nodeEnv: string;
  restPort: number;
  dataPreparationUrl: string;
  dataPreparationUsername: string;
  dataPreparationPassword: string;
  logstashHost: string;
  logstashPort: number;
  apmLogging: boolean;
  apmSecretToken: string;
  apmURL: string;
}
