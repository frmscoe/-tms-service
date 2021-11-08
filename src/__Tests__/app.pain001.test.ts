/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Context } from 'koa';
import { monitorQuote } from '../app.controller';

describe('TMS Service', () => {
  let postSpy: jest.SpyInstance;

  const getMockEmptyRequest = () => JSON.parse('{}');

  const getMockRequest = () =>
    JSON.parse(
      '{"TxTp":"pain.001.001.11","CstmrCdtTrfInitn":{"GrpHdr":{"MsgId":"2669e349-500d-44ba-9e27-7767a16608a0","CreDtTm":"2021-10-07T09:25:31.000Z","NbOfTxs":1,"InitgPty":{"Nm":"Ivan Reese Russel-Klein","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1967-11-23","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-783078685"}}},"PmtInf":{"PmtInfId":"b51ec534-ee48-4575-b6a9-ead2955b8069","PmtMtd":"TRA","ReqdAdvcTp":{"DbtAdvc":{"Cd":"ADWD","Prtry":"Advice with transaction details"}},"ReqdExctnDt":{"Dt":"2021-10-07","DtTm":"2021-10-07T09:25:31.000Z"},"Dbtr":{"Nm":"Ivan Reese Russel-Klein","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1967-11-23","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-783078685"}},"DbtrAcct":{"Id":{"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"PASSPORT"}}},"Nm":"Ivan Russel-Klein"},"DbtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp001"}}},"CdtTrfTxInf":{"PmtId":{"EndToEndId":"b51ec534-ee48-4575-b6a9-ead2955b8069"},"PmtTpInf":{"CtgyPurp":{"Prtry":"TRANSFER"}},"Amt":{"InstdAmt":{"Amt":{"Amt":1,"Ccy":"USD"}},"EqvtAmt":{"Amt":{"Amt":50431891779910900,"Ccy":"USD"},"CcyOfTrf":"USD"}},"ChrgBr":"DEBT","CdtrAgt":{"FinInstnId":{"ClrSysMmbId":{"MmbId":"dfsp002"}}},"Cdtr":{"Nm":"April Sam Adamson","Id":{"PrvtId":{"DtAndPlcOfBirth":{"BirthDt":"1923-04-26","CityOfBirth":"Unknown","CtryOfBirth":"ZZ"},"Othr":{"Id":"+27782722305","SchmeNm":{"Prtry":"MSISDN"}}}},"CtctDtls":{"MobNb":"+27-782722305"}},"CdtrAcct":{"Id":{"Othr":{"Id":"+27783078685","SchmeNm":{"Prtry":"MSISDN"}}},"Nm":"April Adamson"},"Purp":{"Cd":"MP2P"},"RgltryRptg":{"Dtls":{"Tp":"BALANCE OF PAYMENTS","Cd":"100"}},"RmtInf":{"Ustrd":"Payment of USD 49932566118723700.89 from Ivan to April"},"SplmtryData":{"Envlp":{"Doc":{"Cdtr":{"FrstNm":"Ivan","MddlNm":"Reese","LastNm":"Russel-Klein","MrchntClssfctnCd":"BLANK"},"Dbtr":{"FrstNm":"April","MddlNm":"Sam","LastNm":"Adamson","MrchntClssfctnCd":"BLANK"},"DbtrFinSvcsPrvdrFees":{"Ccy":"USD","Amt":499325661187237},"Xprtn":"2021-10-07T09:30:31.000Z"}}}}},"SplmtryData":{"Envlp":{"Doc":{"InitgPty":{"InitrTp":"CONSUMER","Glctn":{"Lat":"-3.1291","Long":"39.0006"}}}}}}}',
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
  });

  describe('Handle Transaction', () => {
    it('should handle successful Quote', async () => {
      const expectedReq = getMockRequest();
      const ctx = { request: { body: expectedReq } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(200);
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
      const ctx = { request: { body: '' } };

      const result = await monitorQuote(ctx as Context);
      expect(result.status).toEqual(500);
    });
  });
});
