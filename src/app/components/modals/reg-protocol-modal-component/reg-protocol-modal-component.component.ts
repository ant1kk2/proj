import {Component, model} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {Protocol} from '../../../interfaces/protocol';

@Component({
  selector: 'app-reg-protocol-modal-component',
  imports: [
    UiModalComponent
  ],
  templateUrl: './reg-protocol-modal-component.component.html',
  styleUrl: './reg-protocol-modal-component.component.scss'
})
export class RegProtocolModalComponentComponent {
  isRegProtocolModalOpen = model.required<boolean>()
  currentProtocol = model.required<Protocol>()
}
