import {Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-ui-input',
  imports: [
    NgClass
  ],
  templateUrl: './ui-input.component.html',
  standalone: true,
  styleUrl: './ui-input.component.scss'
})
export class UiInputComponent {
  inputStyle = input<string>('');
  className = input<string>('');
  iconClass = input<string>('');
  placeholder = input<string>('');
  inputName = input<string>('');
  onInput = output<Event>();

  inputEvent(e: Event) {
    this.onInput.emit(e);
  }

  get fullClass(): string[] {
    return ['input',...this.className().split(' ').filter((c) => c)];
  }

  get icon(): string[] {
    return ['icon',...this.iconClass().split(' ').filter((c) => c)];
  }
}
