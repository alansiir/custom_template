import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comp-biblio',
  templateUrl: './comp-biblio.component.html',
  styleUrls: ['./comp-biblio.component.scss']
})
export class CompBiblioComponent implements OnInit {

  constructor() { }

  menuItems = [
    { label: 'Template', icon: 'mdi:layers-outline' },
    { label: 'Shape', icon: 'mdi:shape' },
    { label: 'Text', icon: 'mdi:format-text' },
    { label: 'Image', icon: 'mdi:image-outline' },
    { label: 'Icon', icon: 'mdi:emoticon-outline' },
    { label: 'Button', icon: 'mdi:gesture-tap-button' },
    { label: 'Form', icon: 'mdi:form-select' },
    
  ];
  
  // État de la fenêtre modale
  isModalOpen = false;
  
  // Données de l'élément sélectionné
  selectedItem: any = null;
  
  // Ouvrir la fenêtre modale avec les détails de l'élément
  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;
  }
  
  // Fermer la fenêtre modale
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  ngOnInit(): void {
  }

}



