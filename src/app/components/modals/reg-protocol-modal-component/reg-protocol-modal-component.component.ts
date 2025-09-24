import {Component, effect, ElementRef, model, QueryList, ViewChildren} from '@angular/core';
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
export class RegProtocolModalComponentComponent{

  @ViewChildren('textInput') textInput!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('checkboxInput') checkboxInput!: QueryList<ElementRef<HTMLInputElement>>;

 constructor() {
   effect(() => {
     this.isRegProtocolModalOpen();
     this.checkboxInput?.forEach(input => {console.log(input?.nativeElement.checked)});
   });
 }

  isRegProtocolModalOpen = model.required<boolean>()
  currentProtocol = model.required<Protocol>()
  measurementsArray = model.required<string[]>()
}
