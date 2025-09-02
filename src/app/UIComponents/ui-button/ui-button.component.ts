import {Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-ui-button',
  imports: [NgClass],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
  standalone: true
})
export class UiButtonComponent {

  workshopId = input<number>(0)
  departmentId = input<number>(0)
  sectionId = input<number>(0)
  unitId = input<number>(0)
  className = input<string>('');
  btnStyle = input<string>('');
  type = input<string>('button');

  btnClick = output<MouseEvent>();

  onClick(e: MouseEvent) {
    this.btnClick.emit(e);
  }

  get fullClass(): string[] {
    return ['btn', ...this.className().split(' ').filter((c) => c)];
  }
}
