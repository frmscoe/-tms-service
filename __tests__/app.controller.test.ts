/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { runServer, server } from '../src/server';
import * as startUpLib from '@frmscoe/frms-coe-startup-lib';
import App from '../src/app';
import { monitorQuote, monitorTransfer, replyQuote, transferResponse } from '../src/app.controller';

let app: App;

beforeAll(async () => {
  app = await runServer();
});

afterAll(async () => {
  app.terminate();
});

describe('Pain013 Messages', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pain.013.001.09","CdtrPmtActvtnReq":{"GrpHdr":{"MsgId":"42665509efd844da90caf468e891aa52256","CreDtTm":"2021-12-03T12:40:16.000Z","NbOfTxs":1,"InitgPty":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}}},"PmtInf":{"PmtInfId":"5ab4fc7355de4ef8a75b78b00a681ed2254","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"DtTm":"2021-12-03T12:40:14.000Z"},"XpryDt":{"DtTm":"2021-11-30T10:38:56.000Z"},"Dbtr":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Grant"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"2c516801007642dfb892944dde1cf845"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER BLANK"}},"Amt":{"InstdAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"Felicia Easton Quill","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1935-05-08","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-707650428"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"Felicia Quill"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"SplmtryData":{"Envlp":{"Doc":{"PyeeRcvAmt":{"Amt":{"Amt":30713.75,"Ccy":"USD"}},"PyeeFinSvcsPrvdrFee":{"Amt":{"Amt":153.57,"Ccy":"USD"}},"PyeeFinSvcsPrvdrComssn":{"Amt":{"Amt":30.71,"Ccy":"USD"}}}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"Glctn":{"Lat":"-3.1609","Long":"38.3588"}}}}}}}',
    );

  const getEmptyTxTpMockRequest = () =>
    JSON.parse(
      '{"TxTp":"","CdtrPmtActvtnReq":{"GrpHdr":{"MsgID":"c46087cb-7688-4b36-9141-c9f1fb1ae582","CreDtTm":"2021-10-21T14:02:54.000Z","NbOfTxs":1,"InitgPty":{"Nm":"Horatio Sam Ford","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1981-04-11","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27721299138","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-721299138"}}},"PmtInf":{"PmtInfId":"b51ec534-ee48-4575-b6a9-ead2955b8069","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"DtTm":"2021-10-07T09:25:31.000Z"},"XpryDt":{"DtTm":"2021-10-21"},"Dbtr":{"Nm":"2021-10-21T14:02:54.000Z","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"2021-10-07","CityOfBirth":"Unknown","CtryOfBirth":"zz"},"Othr":{"Id":"ZZ","SchmeNm":{"Prtry":"+27721299138"}}}},"CtctDtls":{"MobNb":"+27-783078685"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27-721299138","SchmeNm":{"Prtry":"+27721299138"},"Nm":"PASSPORT"}}},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"Horatio Ford"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"b51ec534-ee48-4575-b6a9-ead2955b8069"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER"}},"Amt":{"InstdAmt":{"Amt":{"Amt":50431891779910900,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":50431891779910900,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"April Sam Adamson","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1923-04-26","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27782722305","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-782722305"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Adamson"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 49932566118723700.89 from Ivan to April"},"SplmtryData":{"Envlp":{"Doc":{"PyeeRcvAmt":{"Amt":{"Amt":4906747824834590,"Ccy":"USD"}},"PyeeFinSvcsPrvdrFee":{"Amt":{"Amt":49067478248345.9,"Ccy":"USD"}},"PyeeFinSvcsPrvdrComssn":{"Amt":{"Amt":0,"Ccy":"USD"}}}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"Glctn":{"Lat":"-3.1675","Long":"39.059"}}}}}}}',
    );

  const getEmptyCdtrPmtActvtnReqMockRequest = () => JSON.parse('{"TxTp":"pain.013.001.09","CdtrPmtActvtnReq": ""}');

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post').mockImplementation((url: string, data?: any) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 200 });
      });
    });
  });

  describe('Handle Transaction', () => {
    it('should handle successful Quote', async () => {
      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await replyQuote(ctx as Context);
      expect(result.status).toEqual(200);
    });

    it('should throw error with empty request body', async () => {
      const expectedReq = getMockEmptyRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await replyQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty TxTp field', async () => {
      const expectedReq = getEmptyTxTpMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await replyQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty CdtrPmtActvtnReq field', async () => {
      const expectedReq = getEmptyCdtrPmtActvtnReqMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await replyQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should handle unsuccessful Quote', async () => {
      const ctx = { request: { body: undefined } };

      const result = await replyQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});

describe('Pain001 Messages', () => {
  let responseSpy: jest.SpyInstance;
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pain.001.001.11","CstmrCdtTrfInitn":{"GrpHdr":{"MsgId":"24988b914e3d4cf98a7659b2c45ce063258","CreDtTm":"2021-12-03T12:40:14.000Z","NbOfTxs":1,"InitgPty":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}}},"PmtInf":{"PmtInfId":"5ab4fc7355de4ef8a75b78b00a681ed2569","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"Dt":"2021-12-03","DtTm":"2021-12-03T12:40:14.000Z"},"Dbtr":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Grant"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"2c516801007642dfb892944dde1cf845"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER BLANK"}},"Amt":{"InstdAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"Felicia Easton Quill","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1935-05-08","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-707650428"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"Felicia Quill"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 30713.75 from April to Felicia"},"SplmtryData":{"Envlp":{"Doc":{"Dbtr":{"FrstNm":"April","MddlNm":"Blake","LastNm":"Grant","MrchntClssfctnCd":"BLANK"},"Cdtr":{"FrstNm":"Felicia","MddlNm":"Easton","LastNm":"Quill","MrchntClssfctnCd":"BLANK"},"DbtrFinSvcsPrvdrFees":{"Ccy":"USD","Amt":307.14},"Xprtn":"2021-11-30T10:38:56.000Z"}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"InitrTp":"CONSUMER","Glctn":{"Lat":"-3.1609","Long":"38.3588"}}}}}}}',
    );

  const getEmptyTxTpMockRequest = () =>
    JSON.parse(
      '{"TxTp":"","CstmrCdtTrfInitn":{"GrpHdr":{"MsgId":"2669e349-500d-44ba-9e27-7767a16608a0","CreDtTm":"2021-10-07T09:25:31.000Z","NbOfTxs":1,"InitgPty":{"Nm":"Ivan Reese Russel-Klein","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1967-11-23","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-783078685"}}},"PmtInf":{"PmtInfId":"b51ec534-ee48-4575-b6a9-ead2955b8069","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"Dt":"2021-10-07","DtTm":"2021-10-07T09:25:31.000Z"},"Dbtr":{"Nm":"Ivan Reese Russel-Klein","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1967-11-23","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-783078685"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"PASSPORT"}}},"Nm":"Ivan Russel-Klein"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"b51ec534-ee48-4575-b6a9-ead2955b8069"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER"}},"Amt":{"InstdAmt":{"Amt":{"Amt":1,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":50431891779910900,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"April Sam Adamson","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1923-04-26","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27782722305","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-782722305"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Adamson"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 49932566118723700.89 from Ivan to April"},"SplmtryData":{"Envlp":{"Doc":{"Cdtr":{"FrstNm":"Ivan","MddlNm":"Reese","LastNm":"Russel-Klein","MrchntClssfctnCd":"BLANK"},"Dbtr":{"FrstNm":"April","MddlNm":"Sam","LastNm":"Adamson","MrchntClssfctnCd":"BLANK"},"DbtrFinSvcsPrvdrFees":{"Ccy":"USD","Amt":499325661187237},"Xprtn":"2021-10-07T09:30:31.000Z"}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"InitrTp":"CONSUMER","Glctn":{"Lat":"-3.1291","Long":"39.0006"}}}}}}}',
    );

  const getEmptyCstmrCdtTrfInitnMockRequest = () => JSON.parse('{"TxTp":"pain.001.001.11","CstmrCdtTrfInitn": ""}');

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post').mockImplementation((url: string, data?: any) => {
      return new Promise((resolve, reject) => {
        resolve({ status: 200 });
      });
    });

    responseSpy = jest.spyOn(server, 'handleResponse').mockImplementation(jest.fn());
  });

  describe('Handle Transaction', () => {
    it('should handle successful Quote', async () => {
      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(200);
      expect(responseSpy).toHaveBeenCalled();
    });

    it('should throw error with empty request body', async () => {
      const expectedReq = getMockEmptyRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty TxTp field', async () => {
      const expectedReq = getEmptyTxTpMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should throw error with empty CstmrCdtTrfInitn field', async () => {
      const expectedReq = getEmptyCstmrCdtTrfInitnMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });

    it('should handle unsuccessful Quote', async () => {
      const ctx = { request: { body: undefined } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});

describe('Pacs008 Messages', () => {
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

describe('Pacs002 Messages', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pacs.002.001.12","FIToFIPmtSts":{"GrpHdr":{"MsgId":"30bea71c5a054978ad0da7f94b2a40e9789","CreDtTm":"2021-12-03T15:24:27.000Z"},"TxInfAndSts":{"OrgnlInstrId":"5ab4fc7355de4ef8a75b78b00a681ed2255","OrgnlEndToEndId":"2c516801007642dfb892944dde1cf845897","TxSts":"ACCC","ChrgsInf":[{"Amt":{"Amt":307.14,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":153.57,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}}},{"Amt":{"Amt":30.71,"Ccy":"USD"},"Agt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}],"AccptncDtTm":"2021-12-03T15:24:26.000Z","InstgAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"InstdAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}}}}}',
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

  describe('Handle Transaction', () => {
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
  });
});
