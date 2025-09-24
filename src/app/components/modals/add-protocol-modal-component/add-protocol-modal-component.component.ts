import {Component, ElementRef, model, signal, viewChildren} from '@angular/core';
import {UiModalComponent} from "../../../UIComponents/ui-modal/ui-modal.component";
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {ProtocolJob} from '../../../interfaces/protocolJob';
import {compareJobs} from '../../../helpers/compareJobs';
import {Protocol} from '../../../interfaces/protocol';

@Component({
  selector: 'app-add-protocol-modal-component',
  imports: [
    UiModalComponent,
    UiButtonComponent,
  ],
  templateUrl: './add-protocol-modal-component.component.html',
  standalone: true,
  styleUrl: './add-protocol-modal-component.component.scss'
})
export class AddProtocolModalComponentComponent{
  protocols = model<Protocol[]>([]);

  isAddProtocolModalOpen = model<boolean>(false);
  protocolName = signal<string>("");
  repairType = signal<string>("");
  equipmentInfo = signal<string[]>([]);
  jobs = signal<ProtocolJob[]>([]);
  extraInfo = signal<string[]>([]);
  measurements = signal<number>(0);
  measurementsArray: number[] = []
  inputs = viewChildren<ElementRef<HTMLInputElement | HTMLTextAreaElement>>("textInput")

  addProtocolTitle(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const nameInput = uiBtn.previousElementSibling as HTMLInputElement;
    const nameInputValue = nameInput.value;
    this.protocolName.set(nameInputValue);
    nameInput.value = "";
  }

  addRepairType(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const repairTypeInput = uiBtn.previousElementSibling as HTMLInputElement;
    const repairTypeInputValue = repairTypeInput.value;
    this.repairType.set(repairTypeInputValue);
    repairTypeInput.value = "";
  }

  addEquipmentInfo(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const equipmentInput = uiBtn.previousElementSibling as HTMLInputElement;
    const equipmentInputValue = equipmentInput.value;
    if (!equipmentInputValue) return
    this.equipmentInfo.set([...this.equipmentInfo(), equipmentInputValue]);
    equipmentInput.value = "";
  }

  deleteEquipmentInfoRow(index: number) {
    const updatedEquipmentInfo = this.equipmentInfo().filter((_, i) => i !== index);
    this.equipmentInfo.set(updatedEquipmentInfo);
  }

  addJob(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const jobInput = uiBtn.previousElementSibling as HTMLInputElement;
    const jobInputValue = jobInput.value;
    const jobNumberInput = jobInput.previousElementSibling as HTMLInputElement;
    const jobNumberInputValue = jobNumberInput.value;
    if (!jobInputValue && !jobNumberInputValue) return

    const currentJobs = this.jobs();

    const existing = currentJobs.find(j => j.number === jobNumberInputValue);
    if (existing) {
      existing.jobsDesc.push(jobInputValue);
      this.jobs.set([...currentJobs]);
    } else {
      this.jobs.set([
        ...currentJobs,
        {number: jobNumberInputValue, jobsDesc: [jobInputValue]}
      ].sort((a, b) => compareJobs(a.number, b.number)));
    }
    jobInput.value = "";
    jobNumberInput.value = "";
  }

  deleteJob(jobNumber: string, index: number) {
    const updatedJobs = this.jobs()
      .map(job => {
        if (job.number === jobNumber) {
          const newJobsDesc = [...job.jobsDesc];
          newJobsDesc.splice(index, 1); // удаляем только по индексу
          return {...job, jobsDesc: newJobsDesc};
        }
        return job;
      })
      .filter(job => job.jobsDesc.length > 0);

    this.jobs.set(updatedJobs);
  }

  addExtraInfo(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const extraInfoInput = uiBtn.previousElementSibling as HTMLInputElement;
    const extraInfoInputValue = extraInfoInput.value;
    if (!extraInfoInputValue) return
    this.extraInfo.set([...this.extraInfo(), extraInfoInputValue]);
    extraInfoInput.value = "";
  }

  deleteExtraInfoRow(index: number) {
    const updatedExtraInfo = this.extraInfo().filter((_, i) => i !== index);
    this.extraInfo.set(updatedExtraInfo);
  }

  addMeasurement() {
    this.measurements.update(num => num + 1)
    this.measurementsArray = Array.from({length: this.measurements()}, (_, i) => i);
  }

  deleteMeasurement() {
    this.measurements.update(num => num - 1)
    this.measurementsArray = Array.from({length: this.measurements()}, (_, i) => i);
  }

  createProtocol() {
    const protocolTitle = this.protocolName();
    const protocolRepairType = this.repairType();
    const protocolEquipmentInfo = this.equipmentInfo();
    const protocolJobs = this.jobs();
    const protocolExtraInfo = this.extraInfo();
    const protocolMeasurements = this.measurements();
    const newProtocol: Protocol = {
      title: protocolTitle,
      repairType: protocolRepairType,
      equipmentInfo: protocolEquipmentInfo,
      jobs: protocolJobs,
      extraInfo: protocolExtraInfo,
      measurements: protocolMeasurements,
    }
    this.protocols.update((protocols) => [...protocols, newProtocol])
    this.protocolName.set("");
    this.repairType.set("");
    this.equipmentInfo.set([]);
    this.jobs.set([]);
    this.extraInfo.set([]);
    this.measurements.set(0);
    this.measurementsArray = [];
    this.inputs().forEach(input => {
      input.nativeElement.value = ""
    })
    this.isAddProtocolModalOpen.set(false)
  }
}

