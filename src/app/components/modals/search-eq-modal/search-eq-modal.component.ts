import {Component, model} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';

@Component({
  selector: 'app-search-eq-modal',
  imports: [
    UiModalComponent
  ],
  templateUrl: './search-eq-modal.component.html',
  styleUrl: './search-eq-modal.component.scss'
})
export class SearchEqModalComponent {
  isSearchEqModalOpen = model.required<boolean>()
}
