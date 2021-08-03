export interface IConfig {
  serviceName: string;
  dev: string;
  restport: number;
  grpcport: number;
  nifiHost: string;
  nifiPort: number;
  logstashHost: string;
  logstashPort: number;
  apmLogging: boolean;
  apmSecretToken: string;
  apmURL: string;
}
