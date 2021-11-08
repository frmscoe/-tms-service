/* eslint-disable @typescript-eslint/no-empty-interface, no-prototype-builtins */
import { GrpHdr } from './GrpHdr';
import { PmtInf } from './PmtInf';
import { SplmtryData } from './SplmtryData';

class CdtrPmtActvtnReq {
  GrpHdr: GrpHdr = new GrpHdr();
  PmtInf: PmtInf = new PmtInf();
  SplmtryData: SplmtryData = new SplmtryData();
}

export class Pain01300109Transaction {
  TxTp = '';
  CdtrPmtActvtnReq: CdtrPmtActvtnReq = new CdtrPmtActvtnReq();

  constructor(request: Partial<Pain01300109Transaction>) {
    if (request.TxTp !== 'pain.013.001.09') {
      throw Error('Incoming message format is wrong, missing field TxTP');
    }

    if (!request.hasOwnProperty('CdtrPmtActvtnReq')) {
      throw Error('Incoming message format is wrong, missing field CdtrPmtActvtnReq');
    }

    if (!request?.CdtrPmtActvtnReq?.hasOwnProperty('GrpHdr')) {
      throw Error('Incoming message format is wrong, missing field GrpHdr');
    }

    if (!request?.CdtrPmtActvtnReq?.hasOwnProperty('PmtInf')) {
      throw Error('Incoming message format is wrong, missing field PmtInf');
    }

    if (!request?.CdtrPmtActvtnReq?.hasOwnProperty('SplmtryData')) {
      throw Error('Incoming message format is wrong, missing field SplmtryData');
    }

    Object.assign(this, request);
  }
}

export interface IPain01300109Transaction extends Pain01300109Transaction {}
