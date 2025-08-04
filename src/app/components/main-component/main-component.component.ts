import {Component, inject} from '@angular/core';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {InstructionsService} from '../../services/instructions.service';
import {Instruction} from '../../interfaces/instruction';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-main-component',
  imports: [
    UiButtonComponent,
    DatePipe
  ],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.scss'
})
export class MainComponentComponent {
  instructionsService: InstructionsService = inject(InstructionsService);
  instructions: Instruction[] = [];

  constructor() {
    this.instructionsService
      .getInstructions().subscribe((instructions: Instruction[]): Instruction[] => (this.instructions = instructions))
  }
}
