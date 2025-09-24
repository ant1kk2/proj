import {Component, computed, ElementRef, model, viewChildren} from '@angular/core';
import {UiButtonComponent} from "../../../UIComponents/ui-button/ui-button.component";
import {UiModalComponent} from "../../../UIComponents/ui-modal/ui-modal.component";
import {Protocol} from '../../../interfaces/protocol';
import {compareJobs} from '../../../helpers/compareJobs';

@Component({
  selector: 'app-edit-protocol-modal-component',
  imports: [
    UiButtonComponent,
    UiModalComponent
  ],
  templateUrl: './edit-protocol-modal-component.component.html',
  standalone: true,
  styleUrl: './edit-protocol-modal-component.component.scss'
})
export class EditProtocolModalComponentComponent {
  protocols = model<Protocol[]>([]);
  currentProtocolIndex = model<number>(0)
  isEditProtocolModalOpen = model<boolean>(false);

  protocolName = computed(() => {
    const currentProtocol = this.protocols()[this.currentProtocolIndex()];
    return currentProtocol?.title ?? "";
  });
  repairType = computed(() => {
    const currentProtocol = this.protocols()[this.currentProtocolIndex()];
    return currentProtocol?.repairType ?? "";
  });
  equipmentInfo = computed(() => this.protocols()[this.currentProtocolIndex()]?.equipmentInfo ?? []);
  jobs = computed(() => this.protocols()[this.currentProtocolIndex()]?.jobs ?? []);
  extraInfo = computed(() => this.protocols()[this.currentProtocolIndex()]?.extraInfo ?? []);
  measurements = computed(() => this.protocols()[this.currentProtocolIndex()]?.measurements ?? 0);
  measurementsArray = computed(() =>
    Array.from({length: this.measurements()}, (_, i) => i)
  );

  inputs = viewChildren<ElementRef<HTMLInputElement | HTMLTextAreaElement>>("textInput")

  addProtocolTitle(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const nameInput = uiBtn.previousElementSibling as HTMLInputElement;
    const nameInputValue = nameInput.value;
    this.protocols.update(protocols => protocols
      .map((p, i) => i === this.currentProtocolIndex() ? {...p, title: nameInputValue} : p))
    nameInput.value = "";
  }

  addRepairType(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const repairTypeInput = uiBtn.previousElementSibling as HTMLInputElement;
    const repairTypeInputValue = repairTypeInput.value;
    this.protocols.update(protocols => protocols
      .map((p, i) => i === this.currentProtocolIndex() ? {...p, repairType: repairTypeInputValue} : p))
    repairTypeInput.value = "";
  }

  addEquipmentInfo(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const equipmentInput = uiBtn.previousElementSibling as HTMLInputElement;
    const equipmentInputValue = equipmentInput.value;
    if (!equipmentInputValue) return
    this.protocols.update(protocols =>
      protocols.map((p, i) =>
        i === this.currentProtocolIndex()
          ? {
            ...p,
            equipmentInfo: [...(p.equipmentInfo ?? []), equipmentInputValue],
          }
          : p
      )
    );
    equipmentInput.value = ""
  }

  deleteEquipmentInfoRow(index: number) {
    this.protocols.update(protocols =>
      protocols.map((p, i) =>
        i === this.currentProtocolIndex()
          ? {
            ...p,
            equipmentInfo: ((p.equipmentInfo ?? []) as string[]).filter(
              (_: string, j: number) => j !== index
            ),
          }
          : p
      )
    );
  }

  addJob(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const jobInput = uiBtn.previousElementSibling as HTMLInputElement;
    const jobInputValue = jobInput.value;
    const jobNumberInput = jobInput.previousElementSibling as HTMLInputElement;
    const jobNumberInputValue = jobNumberInput.value;
    if (!jobInputValue && !jobNumberInputValue) return;

    this.protocols.update(protocols =>
      protocols.map((p, i) => {
        if (i !== this.currentProtocolIndex()) return p;

        const currentJobs = p.jobs ?? [];
        const existing = currentJobs.find(j => j.number === jobNumberInputValue);

        if (existing) {
          const updatedJobs = currentJobs.map(j =>
            j.number === jobNumberInputValue
              ? {...j, jobsDesc: [...j.jobsDesc, jobInputValue]}
              : j
          );
          return {...p, jobs: updatedJobs};
        }

        return {
          ...p,
          jobs: [
            ...currentJobs,
            {number: jobNumberInputValue, jobsDesc: [jobInputValue]}
          ].sort((a, b) => compareJobs(a.number, b.number))
        };
      })
    );
    jobInput.value = "";
    jobNumberInput.value = "";
  }

  deleteJob(jobNumber: string, index: number) {
    this.protocols.update(protocols =>
      protocols.map((p, i) => {
        if (i !== this.currentProtocolIndex()) return p;

        const updatedJobs = p.jobs
          .map(job =>
            job.number === jobNumber
              ? {...job, jobsDesc: job.jobsDesc.filter((_, j) => j !== index)}
              : job
          )
          .filter(job => job.jobsDesc.length > 0);

        return {...p, jobs: updatedJobs};
      })
    );
  }

  addExtraInfo(e: MouseEvent) {
    const uiBtn = (e.target as HTMLButtonElement).parentElement!;
    const extraInfoInput = uiBtn.previousElementSibling as HTMLInputElement;
    const extraInfoInputValue = extraInfoInput.value;
    if (!extraInfoInputValue) return
    this.protocols.update(protocols =>
      protocols.map((p, i) =>
        i === this.currentProtocolIndex()
          ? {
            ...p,
            extraInfo: [...(p.extraInfo ?? []), extraInfoInputValue],
          }
          : p
      )
    );
    extraInfoInput.value = ""
  }

  deleteExtraInfoRow(index: number) {
    this.protocols.update(protocols =>
      protocols.map((p, i) =>
        i === this.currentProtocolIndex()
          ? {
            ...p,
            extraInfo: ((p.extraInfo ?? []) as string[]).filter(
              (_: string, j: number) => j !== index
            ),
          }
          : p
      )
    );
  }

  addMeasurement() {
    const currentProtocols = [...this.protocols()];
    const idx = this.currentProtocolIndex();

    if (idx >= 0 && currentProtocols[idx]) {
      currentProtocols[idx] = {
        ...currentProtocols[idx],
        measurements: (currentProtocols[idx].measurements ?? 0) + 1
      };
      this.protocols.set(currentProtocols);
    }
  }

  deleteMeasurement() {
    const currentProtocols = [...this.protocols()];
    const idx = this.currentProtocolIndex();

    if (idx >= 0 && currentProtocols[idx]) {
      const newCount = Math.max(0, (currentProtocols[idx].measurements ?? 0) - 1);
      currentProtocols[idx] = {
        ...currentProtocols[idx],
        measurements: newCount
      };
      this.protocols.set(currentProtocols);
    }
  }

  editProtocol() {
    this.isEditProtocolModalOpen.set(false)
  }

}
