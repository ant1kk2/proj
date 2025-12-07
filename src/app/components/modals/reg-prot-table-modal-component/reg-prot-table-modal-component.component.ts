import {Component, effect, ElementRef, inject, input, model, signal, viewChildren} from '@angular/core';
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

  protocol = signal<Protocol[] | null>(null);
  originProtocol = signal<Protocol[] | null>(null);

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
          this.originProtocol.set(this.divideProtocol(data[0], this.protocolTemplate()!));
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

  getEquipmentInfoDisplay(equipment: any): { text: string, hasNote: boolean } {
    if (!equipment) return {text:"", hasNote: false};
    const note = equipment.note?.trim();
    return { text: Object.entries(equipment)
      .filter(([k]) => k !== 'note')
      .map(([_, v]) => note ? `${v} (${note})` : `${v}`)
      .join(' '),
      hasNote: !!note }
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









  selectedEquipment = new Set<number>();
  selectedExtra = new Set<number>();
  selectedJobs = new Set<string>();


  onEquipmentCheckboxChange(i: number) {
    if (this.selectedEquipment.has(i)) {
      this.selectedEquipment.delete(i);
    } else {
      this.selectedEquipment.add(i);
    }

    this.applyFilter();
  }

  onExtraCheckboxChange(i: number) {
    if (this.selectedExtra.has(i)) {
      this.selectedExtra.delete(i);
    } else {
      this.selectedExtra.add(i);
    }
    this.applyFilter();
  }

  onJobCheckboxChange(m: number, j: number) {
    const key = `${m}-${j}`;

    if (this.selectedJobs.has(key)) {
      this.selectedJobs.delete(key);
    } else {
      this.selectedJobs.add(key);
    }

    this.applyFilter();
  }

  applyFilter() {
    const equipmentIdx = Array.from(this.selectedEquipment);
    const extraIdx = Array.from(this.selectedExtra);
    const jobIdx = Array.from(this.selectedJobs);

    const source = this.originProtocol();
    if (!source) return;

    // если нет ни одного фильтра
    if (
      equipmentIdx.length === 0 &&
      extraIdx.length === 0 &&
      jobIdx.length === 0
    ) {
      this.protocol.set(source);
      return;
    }

    const filtered = source.filter(p => {
      // equipment filter
      const okEquipment =
        equipmentIdx.length === 0 ||
        equipmentIdx.every(i =>
          this.getEquipmentInfoDisplay(p.equipmentInfo![i]).hasNote
        );

      // extra filter
      const okExtra =
        extraIdx.length === 0 ||
        extraIdx.every(i =>
          this.getEquipmentInfoDisplay(p.extraInfo![i]).hasNote
        );

      // jobs filter
      const okJobs =
        jobIdx.length === 0 ||
        jobIdx.every(key => {
          const [m, j] = key.split('-').map(Number);
          return this.getJobDisplay(p.jobs[m])[j].hasNote;
        });

      return okEquipment && okExtra && okJobs;
    });

    this.protocol.set(filtered);
  }





  // onCheckboxChange(e: Event){
  //   const inputEl: HTMLInputElement = e.target as HTMLInputElement;
  //
  //   let next = inputEl.parentElement?.parentElement?.nextElementSibling;
  //   const result = [];
  //
  //   while (next) {
  //     result.push(next);
  //     next = next.nextElementSibling;
  //   }
  //
  //   const indexes: number[] = [];
  //
  //   result.forEach((element, index) => {
  //     if (element.classList.contains("coloured")) {
  //       indexes.push(index);
  //     }
  //   });
  //
  //   this.protocol.update(old =>
  //     old ? old.filter((_, i) => indexes.includes(i)) : old
  //   );
  //
  //   console.log(result);
  //   console.log(this.protocol())
  // }

  protected readonly Object = Object;
}
