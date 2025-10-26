import {Component, effect, input, model, output, signal} from '@angular/core';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {Instruction} from '../../interfaces/instruction';
import {DatePipe} from '@angular/common';
import {
  ManageInstructionModalComponentComponent
} from '../modals/manage-instruction-modal-component/manage-instruction-modal-component.component';
import {
  RegProtocolModalComponentComponent
} from '../modals/reg-protocol-modal-component/reg-protocol-modal-component.component';
import {Protocol} from '../../interfaces/protocol';
import {User} from '../../interfaces/user';
import {
  RegisteredProtocolModalComponentComponent
} from '../modals/registered-protocol-modal-component/registered-protocol-modal-component.component';

@Component({
  selector: 'app-table-component',
  imports: [
    UiButtonComponent,
    DatePipe,
    ManageInstructionModalComponentComponent,
    RegProtocolModalComponentComponent,
    RegisteredProtocolModalComponentComponent
  ],
  templateUrl: './table-component.component.html',
  standalone: true,
  styleUrl: './table-component.component.scss'
})
export class TableComponentComponent {
  user = input.required<User | null>()

  protocolTemplateId = signal<number>(-1);
  instructionId = signal<number>(-1)

  emptyInstruction: Instruction = {
    id: 0,
    number: "",
    title: "",
    date: "",
    user_title: "",
    unit_title: "",
    section_title: "",
    department_title: "",
    workshop_title: "",
    tegs: "",
    path_pdf: null,
    path_word: null
  }

  emptyProtocol: Protocol = {
    id: 0,
    title: "",
    repairType: "",
    jobs: [
      {
        number: "",
        jobsDesc: [""]
      }
    ]
  }

  instructions = input<Instruction[]>([])
  isUnitSelected = model<boolean>(false);
  isManageInstructionModalOpen = signal<boolean>(false)
  currentInstruction = signal<Instruction>(this.emptyInstruction)
  isRegProtocolModalOpen = signal<boolean>(false)
  currentProtocol = signal<Protocol>(this.emptyProtocol)
  measurementsArray = signal<string[]>([])
  isRegisteredProtocolModalOpen = signal(false)

  sortByNumberClick = output<void>()
  sortByTitleClick = output<void>()
  sortByDateClick = output<void>()
  sortByDevClick = output<void>()

  constructor() {
    effect(() => {
      if (!this.isRegProtocolModalOpen().valueOf()) {
        this.currentProtocol.set(this.emptyProtocol)
      }
    });
  }

  onSortByNumberClick(event: MouseEvent): void {
    this.sortByNumberClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions().length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  onSortByTitleClick(event: MouseEvent): void {
    this.sortByTitleClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions().length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  onSortByDateClick(event: MouseEvent): void {
    this.sortByDateClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions().length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  onSortByDevClick(event: MouseEvent): void {
    this.sortByDevClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions().length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  openInstructionModal(i: Instruction) {
    this.isManageInstructionModalOpen.set(true);
    this.currentInstruction.set(i)
  }
}
