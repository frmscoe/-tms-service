import { Context } from 'koa';
import { LoggerService } from './utils';
import { config } from './config';
import axios from 'axios';
import apm from 'elastic-apm-node';
import { Pain001V11Transaction } from './interfaces/iPain001';

const sendToDataPreparation = async (data: Pain001V11Transaction) => {
  const resp = await axios.post(`${config.dataPreparationUrl}`, data, {
    auth: { username: config.dataPreparationUsername, password: config.dataPreparationPassword },
  });

  if (resp.status !== 200) {
    LoggerService.error(resp.data);
  }
};

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('Fetch Typology Expression from Database');
  try {
    const request = (ctx.request.body as unknown) ?? JSON.parse('');

    const transaction: Pain001V11Transaction = new Pain001V11Transaction(request);

    await sendToDataPreparation(transaction);

    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      data: request,
    };
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
    const reqData = (ctx.request.body as unknown) ?? JSON.parse('');

    await sendToDataPreparation(reqData);

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
