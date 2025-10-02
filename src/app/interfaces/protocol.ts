import {ProtocolJob} from './protocolJob';

export interface Protocol {
  id?: number;
  title: string,
  repairType: string,
  equipmentInfo?: string[],
  jobs: ProtocolJob[],
  extraInfo?: string[],
  measurements?: number,
}


export interface RegisteredProtocol {
  id?: number;
  equipmentInfo: {}[],
  jobs: {}[],
  extraInfo: {}[],
  measurements: {}[]
}
