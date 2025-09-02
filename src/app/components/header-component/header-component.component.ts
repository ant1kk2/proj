import {Component, inject, model} from '@angular/core';
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

@Component({
  selector: 'app-header-component',
  imports: [
    AddInstructionModalComponentComponent,
    UiInputComponent,
    AddProtocolModalComponentComponent
  ],
  templateUrl: './header-component.component.html',
  standalone: true,
  styleUrl: './header-component.component.scss'
})

export class HeaderComponentComponent {
  instructionsByQuickSearchService: InstructionsByQuickSearchService = inject(InstructionsByQuickSearchService);

  instructions = model<Instruction[]>([]);

  isAddprotocolModalOpen: boolean = false;

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
}
