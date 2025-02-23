import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    isDropdownOpen = false; 

  constructor() { }

  

  // Basculer l'état du menu déroulant
  toggleDropdown() {
    console.log("dropdown")
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log("drop test", this.isDropdownOpen)
  }

  // Action pour "Settings"
  onSetting() {
    console.log('Paramètres cliqués');
    this.isDropdownOpen = false; // Fermer le menu après le clic
  }

  // Action pour "Logout"
  onLogout() {
    console.log('Déconnexion cliquée');
    this.isDropdownOpen = false; // Fermer le menu après le clic
  }


  ngOnInit(): void {
  }

}
