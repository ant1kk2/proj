import {
  Component,
  inject, model
} from '@angular/core';
import {AsideDataService} from '../../services/asideData.service';
import {Workshop} from '../../interfaces/asideData';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {hideSublist} from '../../helpers/hideSublist';
import {
  InstructionsByUnitService,
  InstructionsBySectionService,
  InstructionsByDepartmentService,
  InstructionsByWorkshopService
} from '../../services/instructions.service';
import {Instruction} from '../../interfaces/instruction';
import {setInstructionColour} from '../../helpers/dateDifference';

@Component({
  selector: 'app-aside-component',
  imports: [
    UiButtonComponent
  ],
  templateUrl: './aside-component.component.html',
  styleUrl: './aside-component.component.scss',
  standalone: true
})
export class AsideComponentComponent {
  asideDataService: AsideDataService = inject(AsideDataService);
  asideData: Workshop[] = [];
  isUnitSelected = model<boolean>(false)
  instructions = model<Instruction[]>([])

  instructionsByWorkshopService: InstructionsByWorkshopService = inject(InstructionsByWorkshopService);
  instructionsByDepartmentService: InstructionsByDepartmentService = inject(InstructionsByDepartmentService);
  instructionsBySectionService: InstructionsBySectionService = inject(InstructionsBySectionService);
  instructionsByUnitService: InstructionsByUnitService = inject(InstructionsByUnitService);

  constructor() {
    this.asideDataService
      .getAsideData()
      .subscribe((asidaData: Workshop[]): Workshop[] => (this.asideData = asidaData));
  }

  protected readonly hideSublist = hideSublist;

  getInstructionByW(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    const workshopId = target.getAttribute('workshop-id');

    this.instructionsByWorkshopService
      .getInstructionsByWorkshopId(+workshopId!)
      .subscribe((instructions: Instruction[]) => {
        this.instructions.set(instructions);
        setInstructionColour(this.instructions())
      });
    this.isUnitSelected.set(false);

  }

  getInstructionByD(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    const departmentId = target.getAttribute('department-id');

    this.instructionsByDepartmentService
      .getInstructionsByDepartmentId(+departmentId!)
      .subscribe((instructions: Instruction[]) => {
        this.instructions.set(instructions);
        setInstructionColour(this.instructions())
      });
    this.isUnitSelected.set(false);
  }

  getInstructionByS(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    const sectionId = target.getAttribute('section-id');

    this.instructionsBySectionService
      .getInstructionsBySectiontId(+sectionId!)
      .subscribe((instructions: Instruction[]) => {
        this.instructions.set(instructions);
        setInstructionColour(this.instructions())
      });
    this.isUnitSelected.set(false);
  }

  getInstructionByU(e: MouseEvent) {
    const target: HTMLElement = e.target as HTMLElement;
    const unitId = target.getAttribute('unit-id');

    this.instructionsByUnitService
      .getInstructionsByUnitId(+unitId!)
      .subscribe((instructions: Instruction[]) => {
        this.instructions.set(instructions);
        setInstructionColour(this.instructions())
      });
    this.isUnitSelected.set(true);
  }
}
