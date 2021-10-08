import { Context } from 'koa';
import { LoggerService } from '../utils';
import { config } from '../config';
import axios from 'axios';
import apm from 'elastic-apm-node';

const sendDataPreparationRequest = async (toSend: Record<string, unknown>) => {
  const dataPrepResponse = await axios.post(`${config.dataPreparationUrl}`, toSend, {
    auth: { username: config.dataPreparationUsername, password: config.dataPreparationPassword },
  });
  if (dataPrepResponse.status !== 200) {
    LoggerService.error(dataPrepResponse.data);
  }
};

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('Fetch Typology Expression from Database');
  try {
    const reqData = ctx.request.body as Record<string, unknown>;
    reqData.TransactionType = 'pain.001.001.11';
    await sendDataPreparationRequest(reqData);
    ctx.status = 200;
    ctx.body = reqData;
  } catch (error) {
    LoggerService.log(error as string);
    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }
  if (span) span.end();
  return ctx;
};

export const monitorTransfer = async (ctx: Context): Promise<Context> => {
  try {
    const reqData = ctx.request.body as Record<string, unknown>;
    reqData.TransactionType = 'pacs.008.001.10';
    await sendDataPreparationRequest(reqData);
    ctx.status = 200;
    ctx.body = reqData;
  } catch (error) {
    LoggerService.log(error as string);
    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }

  return ctx;
};
