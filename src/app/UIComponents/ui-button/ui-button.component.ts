import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  imports: [NgClass],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() type: string = 'button';
  @Input() className: string = '';
  @Input() btnStyle: string = "";

  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(e: MouseEvent) {
    this.btnClick.emit(e);
  }

  get fullClass(): string[] {
    return ['btn', ...this.className.split(' ').filter((c) => c)];
  }
}
