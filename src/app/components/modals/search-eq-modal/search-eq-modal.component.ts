import {Component, model} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {UiInputComponent} from '../../../UIComponents/ui-input/ui-input.component';

@Component({
  selector: 'app-search-eq-modal',
  imports: [
    UiModalComponent,
    UiInputComponent
  ],
  templateUrl: './search-eq-modal.component.html',
  styleUrl: './search-eq-modal.component.scss'
})
export class SearchEqModalComponent {
  isSearchEqModalOpen = model.required<boolean>()

  showSearchedValue(e: Event){

  }
}
