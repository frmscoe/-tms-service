export interface IConfig {
  functionName: string;
  nodeEnv: string;
  restPort: number;
  dataPreparationUrl: string;
  dataPreparationUsername: string;
  dataPreparationPassword: string;
  logstashUrl: string;
  apmLogging: boolean;
  apmSecretToken: string;
  apmURL: string;
}
