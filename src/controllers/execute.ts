import { Context } from 'koa';
import { LoggerService } from '../utils';
import { FlowFileRequest } from '../models/nifi_pb';
import { nifiService } from '../clients/nifi';
import apm from 'elastic-apm-node';

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('TMS initiated gRPC request for monitorQuote');
  try {
    const reqData = ctx.request.body as Record<string, unknown>;
    reqData.TransactionType = 'pain.001.001.11';
    const param: FlowFileRequest = new FlowFileRequest();
    const objJsonB64 = Buffer.from(JSON.stringify(reqData)).toString('base64');
    param.setContent(objJsonB64);
    const resp = await nifiService.send(param);

    ctx.body = { result: resp.getBody() };

    span?.end();
  } catch (error) {
    apm?.setSpanOutcome('failure');
    span?.end();

    LoggerService.log(error as string);
    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }

  return ctx;
};

export const monitorTransfer = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('TMS initiated gRPC request for monitorTransfer');
  try {
    const reqData = ctx.request.body as Record<string, unknown>;
    const param: FlowFileRequest = new FlowFileRequest();
    reqData.TransactionType = 'pacs.008.001.10';
    const objJsonB64 = Buffer.from(JSON.stringify(reqData)).toString('base64');
    param.setContent(objJsonB64);
    const resp = await nifiService.send(param);

    ctx.status = 200;
    ctx.body = { result: resp.getBody() };

    span?.end();
  } catch (error) {
    apm?.setSpanOutcome('failure');
    span?.end();

    LoggerService.log(error as string);
    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }

  return ctx;
};
