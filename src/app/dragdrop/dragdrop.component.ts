import { Component, ElementRef, ViewChild, QueryList, ViewChildren, OnInit } from '@angular/core';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.css']
})
export class DragdropComponent implements OnInit {
  @ViewChildren('draggableButton') draggableButtons!: QueryList<ElementRef>;
  private isDragging = false;
  private currentButtonIndex = -1;
  private offsetX = 0;
  private offsetY = 0;

  // Tableau de boutons avec leurs positions initiales
  buttons = [
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 150, y: 50 },
    { id: 2, x: 50, y: 150 },
    { id: 3, x: 150, y: 150 }
  ];

  constructor() {}

  ngOnInit(): void {}

  // Étape 1 : Démarrer le drag
  startDrag(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      this.isDragging = true;
      const buttonId = parseInt(target.id.split('-')[1], 10);
      this.currentButtonIndex = buttonId;

      // Calculer les offsets pour ajuster la position
      const rect = target.getBoundingClientRect();
      this.offsetX = event.clientX - rect.left;
      this.offsetY = event.clientY - rect.top;
    }
  }

  // Étape 2 : Mettre à jour la position pendant le drag
  onDrag(event: MouseEvent): void {
    if (this.isDragging && this.currentButtonIndex !== -1) {
      const button = this.buttons[this.currentButtonIndex];
      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;

      // Vérifier si le bouton chevauche un autre bouton
      if (!this.isOverlapping(x, y, button.id)) {
        button.x = x;
        button.y = y;

        // Appliquer la nouvelle position au bouton
        const buttonElement = this.draggableButtons.toArray()[button.id].nativeElement;
        buttonElement.style.position = 'absolute';
        buttonElement.style.top = `${y}px`;
        buttonElement.style.left = `${x}px`;
      }
    }
  }

  // Étape 3 : Arrêter le drag
  stopDrag(): void {
    this.isDragging = false;
    this.currentButtonIndex = -1;
  }

  // Vérifier si le bouton chevauche un autre bouton
  isOverlapping(x: number, y: number, currentButtonId: number): boolean {
    const buttonSize = 50; // Taille approximative d'un bouton (px)
    for (const button of this.buttons) {
      if (button.id !== currentButtonId) {
        const distanceX = Math.abs(x - button.x);
        const distanceY = Math.abs(y - button.y);
        if (distanceX < buttonSize && distanceY < buttonSize) {
          return true; // Chevauchement détecté
        }
      }
    }
    return false; // Aucun chevauchement
  }
}