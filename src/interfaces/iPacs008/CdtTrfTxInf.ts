class PmtId {
  InstrId = '';
  EndToEndId = '';
}

class IntrBkSttlmAmt {
  Amt = '';
  Ccy = '';
}

class InstdAmt {
  Amt = '';
  Ccy = '';
}

class ChrgsInf {
  Amt = '';
  Ccy = '';
}

class Amt {
  IntrBkSttlmAmt: IntrBkSttlmAmt = new IntrBkSttlmAmt();
  InstdAmt: InstdAmt = new InstdAmt();
  ChrgsInf: ChrgsInf = new ChrgsInf();
}

class ClrSysMmbId {
  MmbId = '';
}

class FinInstnId {
  ClrSysMmbId: ClrSysMmbId = new ClrSysMmbId();
}

class Agt {
  FinInstnId: FinInstnId = new FinInstnId();
}

class Othr {
  Id = '';
  SchmeNm: SchmeNm = new SchmeNm();
}

class PrvtId {
  DtAndPlcOfBirth: DtAndPlcOfBirth = new DtAndPlcOfBirth();
  Othr: PrvtIdOthr = new PrvtIdOthr();
}

class Id {
  PrvtId: PrvtId = new PrvtId();
}

class DtAndPlcOfBirth {
  BirthDt = '';
  CityOfBirth = '';
  CtryOfBirth = '';
}

class SchmeNm {
  Prtry = '';
}

class PrvtIdOthr {
  Id = '';
  SchmeNm: SchmeNm = new SchmeNm();
}

class InitgPty {
  Nm = '';
  Id: Id = new Id();
  CtctDtls: CtctDtls = new CtctDtls();
}

class CdtrId {
  PrvtId: PrvtId = new PrvtId();
}

class CtctDtls {
  MobNb = '';
}

class Cdtr {
  Nm = '';
  Id: CdtrId = new CdtrId();
  CtctDtls: CtctDtls = new CtctDtls();
}

class CdtrAcctIdOthr {
  Id = '';
  SchmeNm: SchmeNm = new SchmeNm();
}

class CdtrAcctId {
  Othr: CdtrAcctIdOthr = new CdtrAcctIdOthr();
}

class CdtrAcct {
  Id: CdtrAcctId = new CdtrAcctId();
  Nm = '';
}

class Dbtr {
  Nm = '';
  Id: DbtrId = new DbtrId();
  CtctDtls: CtctDtls = new CtctDtls();
}

class DbtrId {
  PrvtId: PrvtId = new PrvtId();
}

class DbtrAcctIdOthr {
  Id = '';
  SchmeNm: SchmeNm = new SchmeNm();
}

class DbtrAcctId {
  Othr: CdtrAcctIdOthr = new CdtrAcctIdOthr();
}

class DbtrAcct {
  Id: DbtrAcctId = new DbtrAcctId();
  Nm = '';
}

class Purp {
  Cd = '';
}

class Dtls {
  Tp = '';
  Cd = '';
}

class CdtrAgt {
  FinInstnId: FinInstnId = new FinInstnId();
}

class DbtrAgt {
  FinInstnId: FinInstnId = new FinInstnId();
}

class RgltryRptg {
  Dtls: Dtls = new Dtls();
}

class RmtInf {
  Ustrd = '';
}

class PyeeRcvAmt {
  Amt: InstdAmt = new InstdAmt();
}

class PyeeFinSvcsPrvdrFee {
  Amt: InstdAmt = new InstdAmt();
}

class PyeeFinSvcsPrvdrComssn {
  Amt: InstdAmt = new InstdAmt();
}

class Doc {
  Xprtn = '';
}

class Envlp {
  Doc: Doc = new Doc();
}

class SplmtryData {
  Envlp: Envlp = new Envlp();
}

export class CdtTrfTxInf {
  PmtId: PmtId = new PmtId();
  Amt: Amt = new Amt();
  ChrgBr = '';
  Agt: Agt = new Agt();
  Cdtr: Cdtr = new Cdtr();
  Dbtr: Dbtr = new Dbtr();
  CdtrAcct: CdtrAcct = new CdtrAcct();
  DbtrAcct: DbtrAcct = new DbtrAcct();
  Purp: Purp = new Purp();
  RgltryRptg: RgltryRptg = new RgltryRptg();
  RmtInf: RmtInf = new RmtInf();
  SplmtryData: SplmtryData = new SplmtryData();
}
