import {Component, inject, signal} from '@angular/core';
import {HeaderComponentComponent} from '../../components/header-component/header-component.component';
import {AsideComponentComponent} from '../../components/aside-component/aside-component.component';
import {TableComponentComponent} from '../../components/table-component/table-component.component';
import {Instruction} from '../../interfaces/instruction';
import {compareInstructionsByNumbers, compareInstructionsByRevNumbers} from '../../helpers/compareInstructionsByNumber';
import {compareByDeveloper, compareByDeveloperRev} from '../../helpers/compareInstructionsByDeveloper';
import {GetUserByIdService} from '../../services/get-user-by-id.service';
import {User} from '../../interfaces/user';

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
  private USER_ID: number = 90;
  instructions: Instruction[] = [];

  private isNumReversed: boolean = false;
  private isTitleReversed: boolean = false;
  private isDateReversed: boolean = false;
  private isDevReversed: boolean = false;
  isUnitSelected: boolean = false;

  private getUserService = inject(GetUserByIdService);

  loading = signal(false);
  error = signal<string | null>(null);
  user = signal<User | null>(null);

  private loadUser(userId: number) {
    this.loading.set(true);
    this.getUserService.getUserById(userId)
      .subscribe({
        next: (data) => {
          this.user.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження користувачiв');
          this.loading.set(false);
        }
      });
  }

  constructor() {
    this.loadUser(this.USER_ID)
  }

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
