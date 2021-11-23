/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { transferResponse } from '../app.controller';

describe('TMS Service /transfer-response', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pacs.002.001.12","FIToFIPmtSts":{"GrpHdr":{"MsgID":"ec3a6a10-0c31-4564-94f6-ed1d79fed91f","CreDtTm":"2021-11-03T07:24:48.000Z"},"TxInfAndSts":{"OrgnlInstrId":"2f68ae16-467a-4ac4-ba32-eb518646aa1d","OrgnlEndToEndId":"5cb8a2db-5c32-41bb-ac27-2597125d50fd","TxSts":"ACSC","ChrgsInf":[{"Amt":{"Amt":157605510200862,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":15918156530287100,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":15918156530287100,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}],"AccptncDtTm":"2021-11-03T07:24:47.000Z","InstgAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"InstdAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}}}',
    );

  const getEmptyTxTpMockRequest = () =>
    JSON.parse(
      '{"TxTp":"","FIToFIPmtSts":{"GrpHdr":{"MsgID":"ec3a6a10-0c31-4564-94f6-ed1d79fed91f","CreDtTm":"2021-11-03T07:24:48.000Z"},"TxInfAndSts":{"OrgnlInstrId":"2f68ae16-467a-4ac4-ba32-eb518646aa1d","OrgnlEndToEndId":"5cb8a2db-5c32-41bb-ac27-2597125d50fd","TxSts":"ACSC","ChrgsInf":[{"Amt":{"Amt":157605510200862,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":15918156530287100,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":15918156530287100,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}],"AccptncDtTm":"2021-11-03T07:24:47.000Z","InstgAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"InstdAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}}}',
    );

  const getEmptyFIToFIPmtStsMockRequest = () => JSON.parse('{"TxTp":"pacs.002.001.12","FIToFIPmtSts":""}');

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post').mockImplementation((url: string, data?: any) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 200 });
      });
    });
  });

  describe('Handle Transaction /transfer-response', () => {
    it('should handle successful Quote', async () => {
      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(200);
    });

    it('should throw error with empty request body', async () => {
      const expectedReq = getMockEmptyRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty TxTp field', async () => {
      const expectedReq = getEmptyTxTpMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty CstmrCdtTrfInitn field', async () => {
      const expectedReq = getEmptyFIToFIPmtStsMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should handle unsuccessful Quote', async () => {
      const ctx = { request: { body: undefined } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should handle unsuccessful Data Prep request', async () => {
      postSpy = jest.spyOn(axios, 'post').mockImplementation((url: string, data?: any) => {
        return new Promise((resolve, reject) => {
          resolve({ status: 500 });
        });
      });

      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await transferResponse(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});
