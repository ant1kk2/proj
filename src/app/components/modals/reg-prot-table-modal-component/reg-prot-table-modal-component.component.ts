import {Component, effect, inject, input, model, signal} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {GetProtocolsService} from '../../../services/get-protocols.service';
import {Measurement, Protocol} from '../../../interfaces/protocol';
import {InstructionsByIdService} from '../../../services/instructions.service';
import {Instruction} from '../../../interfaces/instruction';
import {GetRegisteredProtocolsService} from '../../../services/get-registered-protocols.service';
import {ProtocolJob} from '../../../interfaces/protocolJob';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';

@Component({
  selector: 'app-reg-prot-table-modal-component',
  imports: [
    UiModalComponent,
    UiButtonComponent,
  ],
  templateUrl: './reg-prot-table-modal-component.component.html',
  styleUrl: './reg-prot-table-modal-component.component.scss'
})
export class RegProtTableModalComponentComponent {
  isRegProtTableModalOpen = model.required<boolean>()
  protocolTemplateId = input.required<number>()
  protocolId = input.required<number>()

  instructionId = input.required<number>()
  loading = signal(false);
  error = signal<string | null>(null);
  currentInstruction = model.required<Instruction>()

  protocol = signal<Protocol[] | null>(null)

  protocolTemplate = signal<Protocol | null>(null)
  instruction = signal<Instruction | null>(null)

  measurementsArray = signal<Measurement[] | null>(null)

  private getProtocolsService = inject(GetProtocolsService)
  private getInstructionService = inject(InstructionsByIdService)
  private getRegisteredProtocolsService = inject(GetRegisteredProtocolsService);


  constructor() {
    this.measurementsArray.set(null)
    effect(() => {
      if (this.isRegProtTableModalOpen()) {
        if (this.protocolId() && this.protocolTemplateId() && this.instructionId()) {
          this.loadProtocolTemplate(this.protocolTemplateId())
          this.loadInstruction(this.currentInstruction().id)
          this.loadRegisteredProtocols(this.protocolId())
          this.measurementsArray.set(null)
        }
      } else {
        this.protocolTemplate.set(null);
        this.error.set(null);
        this.measurementsArray.set(null)
      }
    });
  }

  private loadProtocolTemplate(protocolTemplateId: number) {
    this.loading.set(true);
    this.getProtocolsService.getProtocolsByTemplateId(protocolTemplateId)
      .subscribe({
        next: (data) => {
          this.protocolTemplate.set(data[0]);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження шаблону');
          this.loading.set(false);
        }
      });
  }

  private loadInstruction(instructionId: number) {
    this.getInstructionService.getInstructionsById(instructionId)
      .subscribe({
        next: (data) => {
          this.instruction.set(data[0]);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження шаблону інструкції');
        }
      });
  }

  private loadRegisteredProtocols(protocolId: number) {
    this.getRegisteredProtocolsService.getRegisteredProtocolByProtocolId(protocolId)
      .subscribe({
        next: (data) => {
          this.protocol.set(this.divideProtocol(data[0], this.protocolTemplate()!));
          console.log(this.protocol())
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження протоколiв');
        }
      })

  }

  private divideProtocol(protocol: Protocol, template: Protocol): Protocol[] {
    const protocols: Protocol[] = [];

    const eqPerProtocol = template.equipmentInfo?.length || 0;
    const extraPerProtocol = template.extraInfo?.length || 0;
    const jobsPerProtocol = template.jobs?.length || 0;
    const measurementsPerProtocol = template.measurements || 0;

    if (!eqPerProtocol && !jobsPerProtocol) return [protocol];

    const numProtocols = Math.ceil((protocol.jobs?.length || 0) / (jobsPerProtocol || 1));

    for (let i = 0; i < numProtocols; i++) {

      const startEq = i * eqPerProtocol;
      const startExtra = i * extraPerProtocol;
      const startJobs = i * jobsPerProtocol;
      const startMeasurements = i * measurementsPerProtocol;

      protocols.push({
        id: protocol.id,
        title: protocol.title,
        repairType: protocol.repairType,
        equipmentInfo: protocol.equipmentInfo?.slice(startEq, startEq + eqPerProtocol) || [],
        extraInfo: protocol.extraInfo?.slice(startExtra, startExtra + extraPerProtocol) || [],
        jobs: protocol.jobs?.slice(startJobs, startJobs + jobsPerProtocol) || [],
        measurements: measurementsPerProtocol,
        measurementsArray: protocol.measurementsArray?.slice(startMeasurements, startMeasurements + measurementsPerProtocol) || []
      });
    }
    return protocols;
  }

  getEquipmentInfoDisplay(equipment: any): string {
    if (!equipment) return '';
    const note = equipment.note?.trim();
    return Object.entries(equipment)
      .filter(([k]) => k !== 'note')
      .map(([_, v]) => note ? `${v} (${note})` : `${v}`)
      .join(' ');
  }

  getJobDisplay(job: ProtocolJob): { text: string, hasNote: boolean }[] {
    if (!job?.jobsDesc) return [];

    return job.jobsDesc.map(desc => {
      if (typeof desc === 'string') {
        return { text: desc, hasNote: false };
      }

      const note = (desc as any).note?.trim();
      const key = Object.keys(desc).find(k => k !== 'note');
      const value = key ? (desc as any)[key] : '';

      return {
        text: note ? `${value} (${note})` : `${value}`,
        hasNote: !!note
      };
    });
  }

  showMeasurements(measurementsArray: Measurement[]) {
    this.measurementsArray.set(measurementsArray)
  } 

  protected readonly Object = Object;
}
