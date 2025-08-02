import { Component, inject } from '@angular/core';
import { AsideDataService } from '../../services/asideData.service';
import { Workshop } from '../../interfaces/asideData';
import { hideSublist } from '../../helpers/hideSublist';
import { UiButtonComponent } from '../../UIComponents/ui-button/ui-button.component';

@Component({
  selector: 'app-aside-component',
  imports: [UiButtonComponent],
  templateUrl: './aside-component.component.html',
  styleUrl: './aside-component.component.scss',
})
export class AsideComponentComponent {
  asideDataService: AsideDataService = inject(AsideDataService);
  asideData: Workshop[] = [];
  hideSublist: (e: MouseEvent) => void = hideSublist;

  constructor() {
    this.asideDataService
      .getAsideData()
      .subscribe((asidaData: Workshop[]): Workshop[] => (this.asideData = asidaData));
  }

}
