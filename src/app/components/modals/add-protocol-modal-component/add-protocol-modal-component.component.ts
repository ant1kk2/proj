import {Component, model} from '@angular/core';
import {UiModalComponent} from "../../../UIComponents/ui-modal/ui-modal.component";

@Component({
  selector: 'app-add-protocol-modal-component',
  imports: [
    UiModalComponent,
  ],
  templateUrl: './add-protocol-modal-component.component.html',
  styleUrl: './add-protocol-modal-component.component.scss'
})
export class AddProtocolModalComponentComponent {
  isAddprotocolModalOpen = model<boolean>(false)
}

