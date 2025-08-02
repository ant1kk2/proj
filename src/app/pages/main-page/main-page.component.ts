import { Component } from '@angular/core';
import {HeaderComponentComponent} from '../../components/header-component/header-component.component';
import {AsideComponentComponent} from '../../components/aside-component/aside-component.component';
import {MainComponentComponent} from '../../components/main-component/main-component.component';

@Component({
  selector: 'app-main-page',
  imports: [
    HeaderComponentComponent,
    AsideComponentComponent,
    MainComponentComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
