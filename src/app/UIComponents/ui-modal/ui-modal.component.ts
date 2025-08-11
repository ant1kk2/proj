import {Component, EventEmitter, input, Input, model, output, Output} from '@angular/core';
import {UiButtonComponent} from '../ui-button/ui-button.component';

@Component({
  selector: 'app-ui-modal',
  imports: [
    UiButtonComponent
  ],
  templateUrl: './ui-modal.component.html',
  standalone: true,
  styleUrl: './ui-modal.component.scss'
})
export class UiModalComponent {
  isOpen = model<boolean>(false)
  width = input<string>("")

  close(): void {
    this.isOpen.set(false)
  }

  onBackDropClick(event: MouseEvent) {
    if((event.target as HTMLDivElement).classList.contains('modal')){
      this.isOpen.set(false)
    }
  }
}
