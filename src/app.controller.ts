import { Context } from 'koa';
import { LoggerService } from './utils';
import { config } from './config';
import axios from 'axios';
import apm from 'elastic-apm-node';
import { Pain001V11Transaction } from './interfaces/iPain001';
import { Pain01300109Transaction } from './interfaces/iPain013';
import { Pacs00200112V11Transaction } from './interfaces/iPacs002';
import { Pacs008V10Transaction } from './interfaces/iPacs008';

const sendToDataPreparation = async (
  data: Pain001V11Transaction | Pain01300109Transaction | Pacs00200112V11Transaction | Pacs008V10Transaction,
) => {
  const resp = await axios.post(`${config.dataPreparationUrl}`, data, {
    auth: { username: config.dataPreparationUsername, password: config.dataPreparationPassword },
  });

  if (resp.status !== 200) {
    LoggerService.error(resp.data);
  }
};

export const monitorQuote = async (ctx: Context): Promise<Context> => {
  try {
    const request = ctx.request.body ?? JSON.parse('');

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
  return ctx;
};

export const monitorTransfer = async (ctx: Context): Promise<Context> => {
  try {
    const reqData = ctx.request.body ?? JSON.parse('');

    const transaction: Pacs008V10Transaction = new Pacs008V10Transaction(reqData);

    await sendToDataPreparation(reqData);
    LoggerService.log('Pacs.008 Request sent to Data Preparation Service');
    ctx.status = 200;
    ctx.body = transaction;
  } catch (error) {
    if (error instanceof Error) {
      LoggerService.error(error);
      ctx.status = 500;
      ctx.body = { error: error.stack };
    }
  }

  return ctx;
};
export const replyQuote = async (ctx: Context): Promise<Context> => {
  try {
    const request = ctx.request.body;

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
  return ctx;
};

export const transferResponse = async (ctx: Context): Promise<Context> => {
  try {
    const request = ctx.request.body ?? JSON.parse('');

    const transaction: Pacs00200112V11Transaction = new Pacs00200112V11Transaction(request);

    await sendToDataPreparation(transaction);
    LoggerService.log('Request sent to Data Preparation Service');

    ctx.status = 200;
    ctx.body = {
      message: 'Transaction is valid',
      sent: true,
      data: request,
    };
  } catch (error) {
    LoggerService.log(error as string);

    ctx.status = 500;
    ctx.body = {
      error: error,
    };
  }
  return ctx;
};
