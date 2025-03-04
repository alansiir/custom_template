import { Component } from '@angular/core';

@Component({
  selector: 'app-test00',
  templateUrl: './test00.component.html',
  styleUrls: ['./test00.component.scss']
})
export class Test00Component {
  isModalOpen = false; // État du modal

  // Propriétés du bouton
  buttonStyle = {
    backgroundColor: '#4caf50', // Couleur de fond par défaut
    color: '#ffffff', // Couleur du texte par défaut
    fontSize: '16px' // Taille du texte par défaut
  };

  openModal(): void {
    this.isModalOpen = true; // Ouvrir le modal
  }

  closeModal(): void {
    this.isModalOpen = false; // Fermer le modal
  }

  // Gestion du changement de taille du texte
  onFontSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement; // Caster explicitement en HTMLInputElement
    this.buttonStyle.fontSize = target.value + 'px'; // Mettre à jour la taille du texte
  }
}