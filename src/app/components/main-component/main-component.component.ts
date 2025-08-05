import {Component, Input} from '@angular/core';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
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
  @Input() instructions!: Instruction[];
}
