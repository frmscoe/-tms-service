/* eslint-disable @typescript-eslint/no-empty-interface, no-prototype-builtins */
import { TxInfAndSts } from './TxInfAndSts';

class GrpHdr {
  MsgId = '';
  CreDtTm = '';
}

class FIToFIPmtSts {
  GrpHdr: GrpHdr = new GrpHdr();
  TxInfAndSts: TxInfAndSts = new TxInfAndSts();
}

export class Pacs00200112V11Transaction {
  TxTp = '';
  FIToFIPmtSts: FIToFIPmtSts = new FIToFIPmtSts();

  constructor(request: Partial<Pacs00200112V11Transaction>) {
    if (request.TxTp !== 'pacs.002.001.12') {
      throw Error('Incoming message format is wrong, missing field TxTP');
    }

    if (!request.hasOwnProperty('FIToFIPmtSts')) {
      throw Error('Incoming message format is wrong, missing field FIToFIPmtSts');
    }

    if (!request?.FIToFIPmtSts?.hasOwnProperty('GrpHdr')) {
      throw Error('Incoming message format is wrong, missing field GrpHdr');
    }

    if (!request?.FIToFIPmtSts?.hasOwnProperty('TxInfAndSts')) {
      throw Error('Incoming message format is wrong, missing field TxInfAndSts');
    }
  }
}
