/* eslint-disable @typescript-eslint/no-empty-interface, no-prototype-builtins */
import { CdtTrfTxInf } from './CdtTrfTxInf';
import { GrpHdr } from './GrpHdr';

class FIToFICstmrCdt {
  GrpHdr: GrpHdr = new GrpHdr();
  CdtTrfTxInf: CdtTrfTxInf = new CdtTrfTxInf();
}

export class Pacs008V10Transaction {
  TxTp = '';
  FIToFICstmrCdt: FIToFICstmrCdt = new FIToFICstmrCdt();

  constructor(request: Partial<Pacs008V10Transaction>) {
    if (request.TxTp !== 'pacs.008.001.10') {
      throw Error('Incoming message format is wrong, missing field TxTP');
    }

    if (!request.hasOwnProperty('FIToFICstmrCdt')) {
      throw Error('Incoming message format is wrong, missing field FIToFICstmrCdt');
    }

    if (!request?.FIToFICstmrCdt?.hasOwnProperty('GrpHdr')) {
      throw Error('Incoming message format is wrong, missing field GrpHdr');
    }

    if (!request?.FIToFICstmrCdt?.hasOwnProperty('SplmtryData')) {
      throw Error('Incoming message format is wrong, missing field SplmtryData');
    }

    Object.assign(this, request);
  }
}

export interface IPacs008V10Transaction extends Pacs008V10Transaction {}
