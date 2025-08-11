import {
  InstructionsByWorkshopService,
  instructionsByDepartmentService,
  instructionsByGroupService
} from '../../services/instructions.service';
import {Component, inject, model} from '@angular/core';
import {AsideDataService} from '../../services/asideData.service';
import {Workshop} from '../../interfaces/asideData';
import {hideSublist} from '../../helpers/hideSublist';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {Instruction} from '../../interfaces/instruction';

@Component({
  selector: 'app-aside-component',
  imports: [UiButtonComponent],
  templateUrl: './aside-component.component.html',
  styleUrl: './aside-component.component.scss',
  standalone: true
})
export class AsideComponentComponent {
  asideDataService: AsideDataService = inject(AsideDataService);
  asideData: Workshop[] = [];

  hideSublist: (e: MouseEvent) => void = hideSublist;

  instructions = model<Instruction[]>([]);
  isGroupSelected = model<boolean>(false)

  instructionsByWorkshopService: InstructionsByWorkshopService = inject(InstructionsByWorkshopService);
  instructionsByDepartmentService: instructionsByDepartmentService = inject(instructionsByDepartmentService);
  instructionsByGroupService: instructionsByGroupService = inject(instructionsByGroupService);

  showInstructionsByWorkshop(w_title: string) {
    this.instructionsByWorkshopService
      .getInstructionsByWorkshopTitle(w_title)
      .subscribe((instructions: Instruction[]) => {
        this.updateInstructions(instructions);
      });
    this.isGroupSelected.set(false);
  }

  showInstructionsByDepartment(d_title: string, w_title: string) {
    this.instructionsByDepartmentService
      .getInstructionsByDepartmentTitle(d_title, w_title)
      .subscribe((instructions: Instruction[]) => {
        this.updateInstructions(instructions);
      });
    this.isGroupSelected.set(false);
  }

  showInstructionsByGroup(g_title: string, d_title: string, w_title: string) {
    this.instructionsByGroupService
      .getInstructionsByGroupTitle(g_title, d_title, w_title)
      .subscribe((instructions: Instruction[]) => {
        this.updateInstructions(instructions);
      });
    this.isGroupSelected.set(true);
  }

  updateInstructions(newInstructions: Instruction[]) {
    this.instructions.set([...newInstructions]);
  }

  constructor() {
    this.asideDataService
      .getAsideData()
      .subscribe((asidaData: Workshop[]): Workshop[] => (this.asideData = asidaData));
  }
}
