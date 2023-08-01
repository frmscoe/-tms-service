import { type Context } from 'koa';
import { Pacs00200112V11Transaction } from './interfaces/iPacs002';
import { Pacs008V10Transaction } from './interfaces/iPacs008';
import { Pain001V11Transaction } from './interfaces/iPain001';
import { Pain01300109Transaction } from './interfaces/iPain013';
import apm from 'elastic-apm-node';
import { loggerService } from './server';
import axios from 'axios';
import { config } from './config';

const sendToDataPreparation = async (
  data: Pain001V11Transaction | Pain01300109Transaction | Pacs00200112V11Transaction | Pacs008V10Transaction,
  path: string,
): Promise<void> => {
  const resp = await axios.post(`${config.dataPreparationUrl}${path}`, data);

  if (resp.status !== 200) {
    loggerService.error(resp.data);
  }
};

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  const apmTransaction = apm.startTransaction('monitorQuote');
  try {
    const request = ctx.request.body ?? JSON.parse('');

    const transaction: Pain001V11Transaction = new Pain001V11Transaction(request);

    const spanToDataPrep = apm.startSpan('send.dataprep');
    await sendToDataPreparation(transaction, '/execute');
    spanToDataPrep?.end();

    loggerService.log('Request sent to Data Preparation Service');
    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      data: request,
    };
  } catch (error) {
    loggerService.log(error as string);

    ctx.status = 500;
    ctx.body = {
      error,
    };
  }
  apmTransaction?.end();
  return ctx;
};

export const monitorTransfer = async (ctx: Context): Promise<Context> => {
  const apmTransaction = apm.startTransaction('monitorTransfer');
  try {
    const request = ctx.request.body ?? JSON.parse('');

    const transaction: Pacs008V10Transaction = new Pacs008V10Transaction(request);

    const spanToDataPrep = apm.startSpan('send.dataprep');

    await sendToDataPreparation(transaction, '/transfer');
    spanToDataPrep?.end();
    loggerService.log('Pacs.008 Request sent to Data Preparation Service');
    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      data: request,
    };
  } catch (error) {
    if (error instanceof Error) {
      loggerService.error(error);
      ctx.status = 500;
      ctx.body = { error: error.stack };
    }
  }
  apmTransaction?.end();
  return ctx;
};
export const replyQuote = async (ctx: Context): Promise<Context> => {
  const apmTransaction = apm.startTransaction('monitorTransfer');
  try {
    const request = ctx.request.body;

    const transaction: Pain01300109Transaction = new Pain01300109Transaction(request as Record<string, unknown>);

    const spanToDataPrep = apm.startSpan('send.dataprep');

    await sendToDataPreparation(transaction, '/quoteReply');
    spanToDataPrep?.end();
    loggerService.log('Request sent to Data Preparation Service');
    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      data: request,
    };
  } catch (error) {
    loggerService.error(error as string);

    ctx.status = 500;
    ctx.body = {
      error,
    };
  }
  apmTransaction?.end();
  return ctx;
};

export const transferResponse = async (ctx: Context): Promise<Context> => {
  const apmTransaction = apm.startTransaction('transferResponse');
  try {
    const request = ctx.request.body ?? JSON.parse('');
    const transaction: Pacs00200112V11Transaction = new Pacs00200112V11Transaction(request);

    const apmSpan = apm.startSpan('req.sendto.dataprep');
    await sendToDataPreparation(transaction, '/transfer-response');
    apmSpan?.end();
    loggerService.log('Request sent to Data Preparation Service');

    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      sent: true,
      data: request,
    };
  } catch (error) {
    loggerService.error(error as string);

    ctx.status = 500;
    ctx.body = {
      error,
    };
  }
  apmTransaction?.end();
  return ctx;
};
