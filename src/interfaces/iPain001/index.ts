/* eslint-disable @typescript-eslint/no-empty-interface, no-prototype-builtins */
import { GrpHdr } from './GrpHdr';
import { PmtInf } from './PmtInf';
import { SplmtryData } from './SplmtryData';

class CstmrCdtTrfInitn {
  GrpHdr: GrpHdr = new GrpHdr();
  PmtInf: PmtInf = new PmtInf();
  SplmtryData: SplmtryData = new SplmtryData();
}

export class Pain001V11Transaction {
  TxTp = '';
  CstmrCdtTrfInitn: CstmrCdtTrfInitn = new CstmrCdtTrfInitn();

  constructor(request: Partial<Pain001V11Transaction>) {
    if (request.TxTp !== 'pain.001.001.11') {
      throw Error('Incoming message format is wrong, missing field TxTP');
    }

    if (!request.hasOwnProperty('CstmrCdtTrfInitn')) {
      throw Error('Incoming message format is wrong, missing field CstmrCdtTrfInitn');
    }

    if (!request?.CstmrCdtTrfInitn?.hasOwnProperty('GrpHdr')) {
      throw Error('Incoming message format is wrong, missing field GrpHdr');
    }

    if (!request?.CstmrCdtTrfInitn?.hasOwnProperty('PmtInf')) {
      throw Error('Incoming message format is wrong, missing field PmtInf');
    }

    if (!request?.CstmrCdtTrfInitn?.hasOwnProperty('SplmtryData')) {
      throw Error('Incoming message format is wrong, missing field SplmtryData');
    }

    Object.assign(this, request);
  }
}

export interface IPain001V11Transaction extends Pain001V11Transaction {}
