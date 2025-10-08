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

  private isEmptyResultProtocol: boolean = true;
  private currentShownProtocolIndex: number = 0;

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
      this.currentShownProtocolIndex = 0
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

    this.equipmentInfoObject.set(this.currentProtocol().equipmentInfo!.map((val, index) => {
      return {
        [val]: this.equipmentInfoArray()[index],
        note: [...this.equipmentNoteTextInput][index].nativeElement.value,
      }
    }))

    this.extraInfoObject.set(this.currentProtocol().extraInfo!.map((val, index) => {
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

    this.jobsResultsArray.set(this.currentProtocol().jobs.map((val, index) => {
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

    this.resultProtocol.update(registeredProtocol => {
      const copy = [...registeredProtocol];
      copy[this.currentShownProtocolIndex] = {
        equipmentInfo: this.equipmentInfoObject(),
        extraInfo: this.extraInfoObject(),
        jobs: this.jobsResultsArray(),
        measurements: this.measurements()
      }
      return copy
    })

    this.currentShownProtocolIndex = this.resultProtocol().length;

    console.log(this.resultProtocol())

    this.equipmentInfoCheckboxInput.forEach((checkbox, index) => {
      if (!checkbox.nativeElement.checked) {
        [...this.equipmentInfoTextInput][index].nativeElement.value = "";
        [...this.equipmentNoteTextInput][index].nativeElement.value = "";
      }
    })

    this.jobResultCheckboxInput.forEach(checkbox => {
      if (!checkbox.nativeElement.checked) {
        (checkbox.nativeElement.parentElement!.previousElementSibling?.previousElementSibling?.firstElementChild as HTMLInputElement).value = "";
        (checkbox.nativeElement.parentElement!.previousElementSibling?.firstElementChild as HTMLInputElement).value = ""
      }
    })

    this.extraInfoCheckboxInput.forEach((checkbox, index) => {
      if (!checkbox.nativeElement.checked) {
        [...this.extraInfoTextInput][index].nativeElement.value = "";
        [...this.extraInfoNoteTextInput][index].nativeElement.value = "";
      }
    })

    this.measurementCheckboxInput.forEach((checkbox, index) => {
      if (!checkbox.nativeElement.checked) {
        [...this.measurementTextInputTitle][index].nativeElement.value = "";
        [...this.measurementTextInputType][index].nativeElement.value = "";
        [...this.measurementTextInputNumber][index].nativeElement.value = "";
        [...this.measurementTextInputDate][index].nativeElement.value = "";
      }
    })
  }

  showProtocolInfoByProtocolIndex() {
    this.equipmentInfoTextInput.forEach((input, i) => {
      const infos: string[] = Object.values([...this.resultProtocol()][this.currentShownProtocolIndex].equipmentInfo[i]);
      input.nativeElement.value = infos[0];
      [...this.equipmentNoteTextInput][i].nativeElement.value = infos[1];
    })

    this.extraInfoTextInput.forEach((input, i) => {
      const extraInfos: string[] = Object.values([...this.resultProtocol()][this.currentShownProtocolIndex].extraInfo[i]);
      input.nativeElement.value = extraInfos[0];
      [...this.extraInfoNoteTextInput][i].nativeElement.value = extraInfos[1];
    })

    this.measurementTextInputTitle.forEach((input, i) => {
      const measurementInfo: string[] = Object.values([...this.resultProtocol()][this.currentShownProtocolIndex].measurements[i]);
      input.nativeElement.value = measurementInfo[0];
      [...this.measurementTextInputType][i].nativeElement.value = measurementInfo[1];
      [...this.measurementTextInputNumber][i].nativeElement.value = measurementInfo[2];
      [...this.measurementTextInputDate][i].nativeElement.value = measurementInfo[3];
    });

    const jobsArray: any = [];
    this.resultProtocol()[this.currentShownProtocolIndex].jobs
      .forEach(job => (Object.values(job)[1] as {}[])
        .forEach(jobIndex => jobsArray.push(Object.values(jobIndex)))
      )

    this.jobRow.forEach((j, index) => {
      const jobResInput = j.nativeElement.nextElementSibling?.children[0] as HTMLInputElement;
      jobResInput.value = jobsArray[index][0]
      const jobNoteInput = j.nativeElement.nextElementSibling?.nextElementSibling?.children[0] as HTMLInputElement;
      jobNoteInput.value = jobsArray[index][1]
    })
  }

  showPrevEquipmentProtocol() {
    if (this.currentShownProtocolIndex < 1) return
    this.currentShownProtocolIndex -= 1;
    this.showProtocolInfoByProtocolIndex()
  }

  showNextEquipmentProtocol() {
    if (this.currentShownProtocolIndex >= this.resultProtocol().length - 1) return
    this.currentShownProtocolIndex += 1;
    this.showProtocolInfoByProtocolIndex()
  }

  registerProtocol() {
    console.log("registerProtocol clicked")
  }

  /*-------Калькулятор значень в комірках протоколу------------*/
  @ViewChildren('jobResultTextInput') resultInputs!: QueryList<ElementRef<HTMLInputElement>>;
  private cellMap = new Map<string, HTMLInputElement>();
  private activeFormulaInput: HTMLInputElement | null = null;

  private ensureCellMap() {
    this.cellMap.clear();
    this.resultInputs.forEach(el => {
      const input = el.nativeElement;
      const name = input.dataset['cell'];
      if (name) this.cellMap.set(name, input);
    });
  }

  onFocus(input: HTMLInputElement) {
    this.ensureCellMap();

    const formula = input.dataset['formula'];
    if (formula !== undefined) {
      input.value = formula;
    }

    this.activeFormulaInput = input;
  }

  onInput(input: HTMLInputElement) {
    if (input.value.startsWith('=')) {
      input.dataset['formula'] = input.value;
    } else {
      delete input.dataset['formula'];
    }
  }

  onBlur() {
    this.activeFormulaInput = null;
    setTimeout(() => this.recalcAll(), 0);
  }

  onMouseDown(e: MouseEvent, input: HTMLInputElement) {
    if (this.activeFormulaInput &&
      this.activeFormulaInput !== input &&
      this.activeFormulaInput.dataset['formula'] &&
      document.activeElement === this.activeFormulaInput) {
      e.preventDefault();
      this.activeFormulaInput.value += input.dataset['cell'];
      this.activeFormulaInput.dataset['formula'] = this.activeFormulaInput.value;
    }
  }

  private recalcAll() {
    this.ensureCellMap();
    this.resultInputs.forEach(el => {
      const input = el.nativeElement;
      if (input.dataset['formula'] && input !== document.activeElement) {
        const val = this.computeCell(input.dataset['cell']!);
        input.value = isNaN(val) ? 'ERR' : String(val);
      }
    });
  }

  private computeCell(name: string, seen: Set<string> = new Set()): number {

    const el = this.cellMap.get(name);
    if (!el) return 0;
    if (seen.has(name)) return NaN;
    seen.add(name);

    const formula = el.dataset['formula'];
    if (formula && formula.startsWith('=')) {
      let body = formula.slice(1);
      body = body.replace(/[A-Z]+[0-9]+|R[0-9]+/g, ref => {
        const v = this.computeCell(ref, new Set(seen));
        return !isNaN(v) ? String(v) : 'NaN';
      });
      if (!/^[0-9+\-*/().\sNaN]+$/.test(body)) return NaN;
      try {
        const result = Function('"use strict"; return (' + body + ')')();
        return (typeof result === 'number' && isFinite(result)) ? result : NaN;
      } catch {
        return NaN;
      }
    } else {
      const v = parseFloat(el.value);
      return isNaN(v) ? 0 : v;
    }
  }
}
