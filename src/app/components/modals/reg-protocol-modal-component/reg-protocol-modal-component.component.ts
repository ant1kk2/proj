import {Component, effect, ElementRef, model, QueryList, signal, ViewChildren} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {Protocol, RegisteredProtocol} from '../../../interfaces/protocol';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {Instruction} from '../../../interfaces/instruction';

@Component({
  selector: 'app-reg-protocol-modal-component',
  imports: [
    UiModalComponent,
    UiButtonComponent
  ],
  templateUrl: './reg-protocol-modal-component.component.html',
  styleUrl: './reg-protocol-modal-component.component.scss'
})
export class RegProtocolModalComponentComponent {

  isRegProtocolModalOpen = model.required<boolean>()
  currentProtocol = model.required<Protocol>()
  measurementsArray = model.required<string[]>()
  currentInstruction = model.required<Instruction>()

  private isEmptyResultProtocol: boolean = true

  @ViewChildren('equipmentInfoTextInput') equipmentInfoTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('equipmentNoteTextInput') equipmentNoteTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('equipmentInfoCheckboxInput') equipmentInfoCheckboxInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('jobResultTextInput') jobResultTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('jobNoteTextInput') jobNoteTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('jobResultCheckboxInput') jobResultCheckboxInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('jobRow') jobRow!: QueryList<ElementRef<HTMLTableCellElement>>;
  @ViewChildren('extraInfoTextInput') extraInfoTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('extraInfoNoteTextInput') extraInfoNoteTextInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('extraInfoCheckboxInput') extraInfoCheckboxInput!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('measurementTextInputTitle') measurementTextInputTitle!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('measurementTextInputType') measurementTextInputType!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('measurementTextInputNumber') measurementTextInputNumber!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('measurementTextInputDate') measurementTextInputDate!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('measurementCheckboxInput') measurementCheckboxInput!: QueryList<ElementRef<HTMLInputElement>>;



  equipmentInfoArray = signal<string[]>([])
  equipmentInfoObject = signal([{}])
  extraInfoArray = signal<string[]>([])
  extraInfoObject = signal([{}])
  measurements = signal([{}])

  jobsResultsArray = signal([{}])

  resultProtocol = signal<RegisteredProtocol[]>([
    {
      equipmentInfo: [{}],
      jobs: [{}],
      extraInfo: [{}],
      measurements: [{}]
    }]
  )

  constructor() {
    effect(() => {
      this.isRegProtocolModalOpen();
      this.equipmentInfoArray.set([]);
      this.equipmentInfoObject.set([{}]);
      this.extraInfoArray.set([]);
      this.extraInfoObject.set([{}]);
      this.measurements.set([{}])
      this.resultProtocol.set([{
        equipmentInfo: [{}],
        jobs: [{}],
        extraInfo: [{}],
        measurements: [{}]
      }])
      this.isEmptyResultProtocol = true;
      this.equipmentInfoCheckboxInput?.forEach(i => i.nativeElement.checked = false)
      this.jobResultCheckboxInput?.forEach(i => i.nativeElement.checked = false)
      this.extraInfoCheckboxInput?.forEach(i => i.nativeElement.checked = false)
      this.measurementCheckboxInput?.forEach(i => i.nativeElement.checked = false)


    });
  }

  showNextEquipment() {
    this.equipmentInfoArray.set([]);
    this.extraInfoArray.set([]);

    this.equipmentInfoTextInput.forEach((input) => {
      this.equipmentInfoArray.update((arr) => [...arr, input.nativeElement.value]);
    })

    this.extraInfoTextInput.forEach((input) => {
      this.extraInfoArray.update((arr) => [...arr, input.nativeElement.value]);
    })

    this.equipmentInfoObject.set(this.currentProtocol().equipmentInfo!
      .map((val, index) => {
        return {
          [val]: this.equipmentInfoArray()[index],
          note: [...this.equipmentNoteTextInput][index].nativeElement.value,
        }
      }))

    this.extraInfoObject.set(this.currentProtocol().extraInfo!
      .map((val, index) => {
        return {
          [val]: this.extraInfoArray()[index],
          note: [...this.extraInfoNoteTextInput][index].nativeElement.value,
        }
      }))

    const jobRowsArray: string[][] = [];
    const jobNotesArray: string[][] = [];
    let currentGroup: string[] = [];
    let jobNotes: string[] = [];

    this.jobRow.forEach((row, index) => {
      const jobNumber: string = row.nativeElement.dataset["jobNumber"]!;
      const prevJobNumber: string | undefined = [...this.jobRow][index - 1]?.nativeElement.dataset["jobNumber"];
      if (prevJobNumber !== jobNumber && currentGroup.length > 0) {
        jobRowsArray.push(currentGroup);
        jobNotesArray.push(jobNotes)
        currentGroup = [];
        jobNotes = [];
      }
      currentGroup.push([...this.jobResultTextInput][index].nativeElement.value);
      jobNotes.push([...this.jobNoteTextInput][index].nativeElement.value);
    });

    if (currentGroup.length > 0) {
      jobRowsArray.push(currentGroup);
      jobNotesArray.push(jobNotes)
    }

    this.jobsResultsArray.set(this.currentProtocol().jobs
      .map((val, index) => {
        const currentRow = jobRowsArray[index];
        const currentNote = jobNotesArray[index];
        const resArray = val.jobsDesc
          .map((desc, i) => {
            return {
              [desc as string]: currentRow[i],
              note: currentNote[i]
            }
          })
        return {
          number: val.number,
          jobsDesc: resArray
        }
      }))

    const measurementsTitles: string[] = this.measurementTextInputTitle.map((t) => t.nativeElement.value)
    const measurementsTypes: string[] = this.measurementTextInputType.map((t) => t.nativeElement.value)
    const measurementsNumbers: string[] = this.measurementTextInputNumber.map((t) => t.nativeElement.value)
    const measurementsDates: string[] = this.measurementTextInputDate.map((t) => t.nativeElement.value)

    this.measurements.set(this.measurementsArray().map((_, index) => {
      return {
        title: measurementsTitles[index],
        type: measurementsTypes[index],
        number: measurementsNumbers[index],
        date: measurementsDates[index],
      }
    }))

    if (this.isEmptyResultProtocol) {
      this.resultProtocol.set([{
        equipmentInfo: this.equipmentInfoObject(),
        jobs: this.jobsResultsArray(),
        extraInfo: this.extraInfoObject(),
        measurements: this.measurements()
      }])
      this.isEmptyResultProtocol = false
    } else {
      this.resultProtocol.set([...this.resultProtocol(), {
        equipmentInfo: this.equipmentInfoObject(),
        jobs: this.jobsResultsArray(),
        extraInfo: this.extraInfoObject(),
        measurements: this.measurements()
      }])
    }

    console.log(this.resultProtocol())

    this.equipmentInfoCheckboxInput.forEach((checkbox, index) => {
        if (!checkbox.nativeElement.checked) {
          [...this.equipmentInfoTextInput][index].nativeElement.value = "";
          [...this.equipmentNoteTextInput][index].nativeElement.value = "";
        }
      }
    )

    this.jobResultCheckboxInput.forEach((checkbox) => {
        if (!checkbox.nativeElement.checked) {
          (checkbox.nativeElement.parentElement!.previousElementSibling?.previousElementSibling?.firstElementChild as HTMLInputElement).value = "";
          (checkbox.nativeElement.parentElement!.previousElementSibling?.firstElementChild as HTMLInputElement).value = ""
        }
      }
    )

    this.extraInfoCheckboxInput.forEach((checkbox, index) => {
        if (!checkbox.nativeElement.checked) {
          [...this.extraInfoTextInput][index].nativeElement.value = "";
          [...this.extraInfoNoteTextInput][index].nativeElement.value = "";
        }
      }
    )

    this.measurementCheckboxInput.forEach((checkbox, index) => {
        if (!checkbox.nativeElement.checked) {
          [...this.measurementTextInputTitle][index].nativeElement.value = "";
          [...this.measurementTextInputType][index].nativeElement.value = "";
          [...this.measurementTextInputNumber][index].nativeElement.value = "";
          [...this.measurementTextInputDate][index].nativeElement.value = "";
        }
      }
    )

  }

  showPrevEquipment() {
    console.log("showPrevEquipment clicked")
  }

  registerProtocol() {
    console.log("registerProtocol clicked")
  }
}
