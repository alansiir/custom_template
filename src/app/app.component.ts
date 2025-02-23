import { Component } from '@angular/core';
import { SideNavToggle } from './sidenav2/sidenav2.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  isSideNavCollapsed = false;
  screenWidth = 0;

  
  selectedOptions: any[] = []; // Stocke les valeurs sélectionnées

  options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];


  onToggleSidNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed; // Met à jour l'état du side nav
}
}
