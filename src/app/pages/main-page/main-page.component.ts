import {Component} from '@angular/core';
import {HeaderComponentComponent} from '../../components/header-component/header-component.component';
import {AsideComponentComponent} from '../../components/aside-component/aside-component.component';
import {TableComponentComponent} from '../../components/table-component/table-component.component';
import {Instruction} from '../../interfaces/instruction';
import {compareInstructionsByNumbers, compareInstructionsByRevNumbers} from '../../helpers/compareInstructionsByNumber';
import {compareByDeveloper, compareByDeveloperRev} from '../../helpers/compareInstructionsByDeveloper';

@Component({
  selector: 'app-main-page',
  imports: [
    HeaderComponentComponent,
    AsideComponentComponent,
    TableComponentComponent
  ],
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  instructions: Instruction[] = [];

  private isNumReversed: boolean = false;
  private isTitleReversed: boolean = false;
  private isDateReversed: boolean = false;
  private isDevReversed: boolean = false;
  isUnitSelected: boolean = false;

  sortInstructionsByNumber() {
    this.instructions = this.isNumReversed ?
      [...this.instructions.sort(compareInstructionsByNumbers)] :
      [...this.instructions.sort(compareInstructionsByRevNumbers)]
    this.isNumReversed = !this.isNumReversed
  }

  sortInstructionsByTitle() {
    this.instructions =
      [...this.instructions.sort((a, b) => this.isTitleReversed ?
        a.title.localeCompare(b.title) :
        b.title.localeCompare(a.title))]
    this.isTitleReversed = !this.isTitleReversed
  }

  sortInstructionsByDate() {
    this.instructions = [...this.instructions.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return this.isDateReversed ? +dateA - +dateB : +dateB - +dateA
    })];
    this.isDateReversed = !this.isDateReversed
  }

  sortInstructionsByDeveloper() {
    this.instructions = this.isDevReversed ?
      [...this.instructions.sort(compareByDeveloper)] :
      [...this.instructions.sort(compareByDeveloperRev)]
    this.isDevReversed = !this.isDevReversed
  }
}
