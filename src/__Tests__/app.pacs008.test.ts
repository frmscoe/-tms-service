/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { monitorTransfer } from '../app.controller';

describe('TMS Service', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pacs.008.001.10","FIToFICstmrCdt":{"GrpHdr":{"MsgID":"00e2e0ad-244c-4ce9-86ac-6a4ec9708156","CreDtTm":"2021-11-15T08:49:24.000Z","NbOfTxs":1,"SttlmInf":{"SttlmMtd":"CLRG"}},"CdtTrfTxInf":{"PmtId":{"InstrId":"3aec1e16-da13-4204-aeb2-666d3126d212","EndToEndId":"e0b608a6-5050-4938-9817-51b75b3db118"},"IntrBkSttlmAmt":{"Amt":{"Amt":40,"Ccy":"USD"}},"InstdAmt":{"Amt":{"Amt":40,"Ccy":"USD"}},"ChrgBr":"DEBT","ChrgsInf":{"Amt":{"Amt":40,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},"InitgPty":{"Nm":"Geoffrey Indigo Nadir","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1954-10-27","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-876498198"}},"Dbtr":{"Nm":"Geoffrey Indigo Nadir","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1954-10-27","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-876498198"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"},"Nm":"Geoffrey Nadir"}}},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"John Kelly Adamson","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1946-04-14","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27731695689","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-731695689"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27731695689","SchmeNm":{"Prtry":"MSISDN"},"Nm":"John Adamson"}}},"Purp":{"Cd":"MP2P"}},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 22273907694299600.17 from Geoffrey to John"},"SplmtryData":{"Envlp":{"Doc":{"Xprtn":"2021-11-15T08:54:20.000Z"}}}}}',
    );

  const getEmptyTxTpMockRequest = () =>
    JSON.parse(
      '{"TxTp":"","FIToFICstmrCdt":{"GrpHdr":{"MsgID":"00e2e0ad-244c-4ce9-86ac-6a4ec9708156","CreDtTm":"2021-11-15T08:49:24.000Z","NbOfTxs":1,"SttlmInf":{"SttlmMtd":"CLRG"}},"CdtTrfTxInf":{"PmtId":{"InstrId":"3aec1e16-da13-4204-aeb2-666d3126d212","EndToEndId":"e0b608a6-5050-4938-9817-51b75b3db118"},"IntrBkSttlmAmt":{"Amt":{"Amt":40,"Ccy":"USD"}},"InstdAmt":{"Amt":{"Amt":40,"Ccy":"USD"}},"ChrgBr":"DEBT","ChrgsInf":{"Amt":{"Amt":40,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},"InitgPty":{"Nm":"Geoffrey Indigo Nadir","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1954-10-27","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-876498198"}},"Dbtr":{"Nm":"Geoffrey Indigo Nadir","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1954-10-27","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-876498198"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27876498198","SchmeNm":{"Prtry":"MSISDN"},"Nm":"Geoffrey Nadir"}}},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"John Kelly Adamson","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1946-04-14","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27731695689","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-731695689"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27731695689","SchmeNm":{"Prtry":"MSISDN"},"Nm":"John Adamson"}}},"Purp":{"Cd":"MP2P"}},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 22273907694299600.17 from Geoffrey to John"},"SplmtryData":{"Envlp":{"Doc":{"Xprtn":"2021-11-15T08:54:20.000Z"}}}}}',
    );

  const getEmptyFIToFICstmrCdtMockRequest = () => JSON.parse('{"TxTp":"pacs.008.001.10","FIToFICstmrCdt": ""}');

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post').mockImplementation((url: string, data?: any) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 200 });
      });
    });
  });

  describe('Handle Transaction', () => {
    it('should handle successful Transfer', async () => {
      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(200);
    });

    it('should throw error with empty request body', async () => {
      const expectedReq = getMockEmptyRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty TxTp field', async () => {
      const expectedReq = getEmptyTxTpMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty CdtTrfTxInf field', async () => {
      const expectedReq = getEmptyFIToFICstmrCdtMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should handle unsuccessful Transfer', async () => {
      const ctx = { request: { body: '' } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});
