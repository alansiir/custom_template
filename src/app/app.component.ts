/* import { Component } from '@angular/core';
import { SideNavToggle } from './sidenav2/sidenav2.component';
import { ApiService } from './services/api.service';



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
 */
import { Component } from '@angular/core';
import { SideNavToggle } from './sidenav2/sidenav2.component';
import { ApiService } from './services/api.service';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  isSideNavCollapsed = false;
  screenWidth = 0;
  
  // Variables pour le test de connexion
  isDevMode = !environment.production;
  apiResponse: any = null;
  apiError: string | null = null;

  // Options pour les sélections
  selectedOptions: any[] = [];
  options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  constructor(private apiService: ApiService) {}

  // Test de connexion à l'API
  testApiConnection() {
    this.apiResponse = null;
    this.apiError = null;
    
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.apiResponse = data;
        console.log('API Response:', data);
      },
      error: (err) => {
        this.apiError = 'Échec de connexion à l\'API';
        console.error('API Error:', err);
      }
    });
  }

  // Gestion de la navigation latérale
  onToggleSidNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}