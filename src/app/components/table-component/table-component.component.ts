import {Component, input, output} from '@angular/core';
import {UiButtonComponent} from '../../UIComponents/ui-button/ui-button.component';
import {Instruction} from '../../interfaces/instruction';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-table-component',
  imports: [
    UiButtonComponent,
    DatePipe
  ],
  templateUrl: './table-component.component.html',
  standalone: true,
  styleUrl: './table-component.component.scss'
})
export class TableComponentComponent {
  instructions = input<Instruction[]>([])
  isGroupSelected = input<boolean>(false);

  sortByNumberClick = output<void>()
  sortByTitleClick = output<void>()
  sortByDateClick = output<void>()
  sortByDevClick = output<void>()

  onSortByNumberClick(event: MouseEvent): void {
    this.sortByNumberClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions.length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  onSortByTitleClick(event: MouseEvent): void {
    this.sortByTitleClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions.length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  onSortByDateClick(event: MouseEvent): void {
    this.sortByDateClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions.length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
    console.log(this.instructions())
  }

  onSortByDevClick(event: MouseEvent): void {
    this.sortByDevClick.emit()
    const target = event.currentTarget as HTMLButtonElement;
    this.instructions.length && target.firstElementChild!.classList.toggle("icon-sort-amount-desc")
  }

  protected readonly encodeURIComponent = encodeURIComponent;
}
