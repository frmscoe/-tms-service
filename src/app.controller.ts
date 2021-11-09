import { Context } from 'koa';
import { LoggerService } from './utils';
import { config } from './config';
import axios from 'axios';
import apm from 'elastic-apm-node';
import { Pain001V11Transaction } from './interfaces/iPain001';
import { Pain01300109Transaction } from './interfaces/iPain013';
import { Pacs00200112V11Transaction } from './interfaces/iPacs002';

const sendToDataPreparation = async (data: Pain001V11Transaction | Pain01300109Transaction | Pacs00200112V11Transaction) => {
  const resp = await axios.post(`${config.dataPreparationUrl}`, data, {
    auth: { username: config.dataPreparationUsername, password: config.dataPreparationPassword },
  });

  if (resp.status !== 200) {
    LoggerService.error(resp.data);
  }
};

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('Transaction request received');
  try {
    const request = (ctx.request.body as unknown) ?? JSON.parse('');

    const transaction: Pain001V11Transaction = new Pain001V11Transaction(request);

    await sendToDataPreparation(transaction);

    LoggerService.log('Request sent to Data Preparation Service');
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

export const replyQuote = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('Transaction request received');
  try {
    const request = (ctx.request.body as unknown) ?? JSON.parse('');

    const transaction: Pain01300109Transaction = new Pain01300109Transaction(request);

    await sendToDataPreparation(transaction);
    LoggerService.log('Request sent to Data Preparation Service');
    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      data: request,
    };
  } catch (error) {
    console.log(error);
    LoggerService.log(error as string);

    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }
  if (span) span.end();
  return ctx;
};

export const transferResponse = async (ctx: Context): Promise<Context> => {
  const span = apm.startSpan('Transfer response received');
  try {
    const request = (ctx.request.body as unknown) ?? JSON.parse('');

    const transaction: Pacs00200112V11Transaction = new Pacs00200112V11Transaction(request);

    await sendToDataPreparation(transaction);
    LoggerService.log('Request sent to Data Preparation Service');

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
