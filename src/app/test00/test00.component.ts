import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test00',
  templateUrl: './test00.component.html',
  styleUrls: ['./test00.component.scss']
})
export class Test00Component implements OnInit {

  constructor() { }

  isModalOpen = false;
  bgColor = '#3498db'; // Couleur par défaut du fond
  textColor = '#ffffff'; // Couleur par défaut du texte

  // Ouvre/Ferme la modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  ngOnInit(): void {
  }

}
