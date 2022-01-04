/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { replyQuote } from '../app.controller';

describe('TMS Service', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pain.013.001.09","CdtrPmtActvtnReq":{"GrpHdr":{"MsgId":"42665509efd844da90caf468e891aa52","CreDtTm":"2021-12-03T12:40:16.000Z","NbOfTxs":1,"InitgPty":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}}},"PmtInf":{"PmtInfId":"5ab4fc7355de4ef8a75b78b00a681ed2","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"DtTm":"2021-12-03T12:40:14.000Z"},"XpryDt":{"DtTm":"2021-11-30T10:38:56.000Z"},"Dbtr":{"Nm":"April Blake Grant","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1968-02-01","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-730975224"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27730975224","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Grant"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"2c516801007642dfb892944dde1cf845"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER BLANK"}},"Amt":{"InstdAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":31020.89,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"Felicia Easton Quill","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1935-05-08","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-707650428"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27707650428","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"Felicia Quill"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"SplmtryData":{"Envlp":{"Doc":{"PyeeRcvAmt":{"Amt":{"Amt":30713.75,"Ccy":"USD"}},"PyeeFinSvcsPrvdrFee":{"Amt":{"Amt":153.57,"Ccy":"USD"}},"PyeeFinSvcsPrvdrComssn":{"Amt":{"Amt":30.71,"Ccy":"USD"}}}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"Glctn":{"Lat":"-3.1609","Long":"38.3588"}}}}}}}',
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
