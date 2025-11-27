import {ProtocolJob} from './protocolJob';

export interface Protocol {
  id?: number;
  title: string,
  repairType: string,
  equipmentInfo?: string[],
  extraInfo?: string[],
  jobs: ProtocolJob[],
  measurements?: number,
  measurementsArray?: Measurement[],
}


export interface RegisteredProtocol {
  id?: number;
  equipmentInfo: {}[],
  jobs: {}[],
  extraInfo: {}[],
  measurements: {}[]
}

export interface RegProtocol {
  id: number;
  instruction_id: number,
  protocol_date: string,
  protocol_number: string,
  protocol_template_id: number,
  protocol_title: string,
  user_id: number,
  user_name?: string
}

export interface Measurement {
  date: string,
  number: string,
  title: string,
  type: string,
}
