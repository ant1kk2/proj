import {Component, inject, input, model, signal} from '@angular/core';
import {
  AddInstructionModalComponentComponent
} from '../modals/add-instruction-modal-component/add-instruction-modal-component.component';
import {UiInputComponent} from '../../UIComponents/ui-input/ui-input.component';
import {debounce} from '../../helpers/debounce';
import {Instruction} from '../../interfaces/instruction';
import {InstructionsByQuickSearchService} from '../../services/instructions.service';
import {
  AddProtocolModalComponentComponent
} from '../modals/add-protocol-modal-component/add-protocol-modal-component.component';
import {Protocol} from '../../interfaces/protocol';
import {
  EditProtocolModalComponentComponent
} from '../modals/edit-protocol-modal-component/edit-protocol-modal-component.component';
import {User} from '../../interfaces/user';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {SearchEqModalComponent} from '../modals/search-eq-modal/search-eq-modal.component';

@Component({
  selector: 'app-header-component',
  imports: [
    AddInstructionModalComponentComponent,
    UiInputComponent,
    AddProtocolModalComponentComponent,
    EditProtocolModalComponentComponent,
    UiButtonComponent,
    SearchEqModalComponent
  ],
  templateUrl: './header-component.component.html',
  standalone: true,
  styleUrl: './header-component.component.scss'
})

export class HeaderComponentComponent {
  protocols: Protocol[] = [];
  user = input.required<User | null>()

  instructionsByQuickSearchService: InstructionsByQuickSearchService = inject(InstructionsByQuickSearchService);

  instructions = model<Instruction[]>([]);

  isAddProtocolModalOpen: boolean = false;
  isEditProtocolModalOpen: boolean = false;
  isSearchEqModalOpen = signal<boolean>(false)
  currentProtocol: Protocol = {jobs: [], repairType: '', title: ''};
  currentProtocolIndex: number = 0;

  updateInstructions(newInstructions: Instruction[]) {
    this.instructions.set([...newInstructions]);
  }

  showInstructionsByQuickSearch(value: string) {
    this.instructionsByQuickSearchService
      .getInstructionsByQuickSearch(value)
      .subscribe((instructions: Instruction[]) => {
        this.updateInstructions(instructions);
      });
  }

  searchDebounced = debounce((value: string) => {
    // if (value === "") return
    this.showInstructionsByQuickSearch(value);
  }, 1000);

  showSearchedValue(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value;
    this.searchDebounced(inputValue)
  }

  openSearchEquipmentModal(){
    this.isSearchEqModalOpen.set(true)
  }
}
