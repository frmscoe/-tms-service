/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { monitorTransfer } from '../app.controller';

describe('TMS Service', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pacs.008.001.10","FIToFICstmrCdt":{"GrpHdr":{"MsgId":"8cc4f6ffb4fd4e31b42aec0ed5d600a0123","CreDtTm":"2021-12-03T15:24:25.000Z","NbOfTxs":1,"SttlmInf":{"SttlmMtd":"CLRG"}},"CdtTrfTxInf":{"PmtId":{"InstrId":"5ab4fc7355de4ef8a75b78b00a681ed2879","EndToEndId":"2c516801007642dfb892944dde1cf845789"},"IntrBkSttlmAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"}},"InstdAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"}},"ChrgBr":"DEBT","ChrgsInf":{"Amt":{"Amt":307.14,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},"InitgPty":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}},"Dbtr":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Grant"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"Felicia Easton Quill","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1935-05-08","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-707650428"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"Felicia Quill"},"Purp":{"Cd":"MP2P"}},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 30713.75 from April to Felicia"},"SplmtryData":{"Envlp":{"Doc":{"Xprtn":"2021-11-30T10:38:56.000Z"}}}}}',
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
      const ctx = { request: { body: undefined } };

      const result = await monitorTransfer(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});
