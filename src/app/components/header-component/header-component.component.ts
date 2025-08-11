import {Component} from '@angular/core';
import {
  AddInstructionModalComponentComponent
} from '../modals/add-instruction-modal-component/add-instruction-modal-component.component';

@Component({
  selector: 'app-header-component',
  imports: [
    AddInstructionModalComponentComponent
  ],
  templateUrl: './header-component.component.html',
  standalone: true,
  styleUrl: './header-component.component.scss'
})
export class HeaderComponentComponent {

}
