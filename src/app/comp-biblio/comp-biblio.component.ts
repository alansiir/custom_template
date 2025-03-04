import { Component } from '@angular/core';

@Component({
  selector: 'app-comp-biblio',
  templateUrl: './comp-biblio.component.html',
  styleUrls: ['./comp-biblio.component.scss']
})
export class CompBiblioComponent {
  menuItems = [
    { label: 'Template', icon: 'mdi:layers-outline' },
    { label: 'Shape', icon: 'mdi:shape' },
    { label: 'Text', icon: 'mdi:format-text' },
    { label: 'Image', icon: 'mdi:image-outline' },
    { label: 'Icon', icon: 'mdi:emoticon-outline' },
    { label: 'Button', icon: 'mdi:gesture-tap-button' },
    { label: 'Form', icon: 'mdi:form-select' }
  ];

  isModalOpen = false;
  selectedItem: any = null;
  hasClonedTable = false;

  constructor() {}

  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = !this.isModalOpen;
    console.log('Modal ouvert ?', this.isModalOpen);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  startDrag(event: DragEvent): void {
    if (event.dataTransfer && event.target) {
      const target = event.target as HTMLElement;
      event.dataTransfer.setData('text/plain', target.id);
      target.classList.add('dragging');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
      dropZone.classList.add('dragging-over');
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
  
    if (event.dataTransfer) {
      const itemId = event.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(itemId);
  
      if (!draggedElement) {
        console.error(`Élément avec l'ID "${itemId}" introuvable.`);
        return;
      }
  
      // Clone l'élément
      const clonedElement = draggedElement.cloneNode(true) as HTMLElement;
      clonedElement.id = `cloned-${Date.now()}`; // ID unique
      clonedElement.classList.add('cloned-table');
      clonedElement.style.position = 'absolute';
      clonedElement.style.pointerEvents = 'auto';
  
      // Appliquer la même largeur que l'élément d'origine
      clonedElement.style.width = `${draggedElement.offsetWidth}px`;
  
      // Ajouter un bouton "Supprimer"
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-btn';
      removeButton.textContent = '❌';
      removeButton.style.position = 'absolute';
      removeButton.style.top = '5px';
      removeButton.style.right = '5px';
      removeButton.style.cursor = 'pointer';
      removeButton.style.backgroundColor = 'red';
      removeButton.style.color = 'white';
      removeButton.style.border = 'none';
      removeButton.style.padding = '5px 10px';
      removeButton.style.borderRadius = '50%';
  
      removeButton.addEventListener('click', () => {
        clonedElement.remove();
        this.hasClonedTable = Array.from(clonedElement.parentElement?.children || []).some(
          child => child.classList.contains('cloned-table')
        );
      });
  
      clonedElement.appendChild(removeButton);
  
      // Gestion du déplacement interne
      let isDraggingInternally = false;
      let offsetX = 0;
      let offsetY = 0;
  
      clonedElement.addEventListener('mousedown', (e: MouseEvent) => {
        isDraggingInternally = true;
        const rect = clonedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
  
      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingInternally) return;
  
        const dropZone = document.querySelector('.drop-zone') as HTMLElement;
        if (!dropZone) return;
  
        const dropZoneRect = dropZone.getBoundingClientRect();
  
        // Calculer les nouvelles coordonnées par rapport à la drop-zone
        let x = e.clientX - dropZoneRect.left - offsetX;
        let y = e.clientY - dropZoneRect.top - offsetY;
  
        // Limiter les coordonnées pour rester dans la drop-zone
        x = Math.max(0, Math.min(x, dropZoneRect.width - clonedElement.offsetWidth));
        y = Math.max(0, Math.min(y, dropZoneRect.height - clonedElement.offsetHeight));
  
        // Appliquer les nouvelles coordonnées
        clonedElement.style.left = `${x}px`;
        clonedElement.style.top = `${y}px`;
      };
  
      const onMouseUp = () => {
        isDraggingInternally = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
  
      // Ajouter le clone à la zone cible
      const dropZone = document.querySelector('.drop-zone');
      if (dropZone && dropZone instanceof HTMLElement) {
        dropZone.classList.remove('dragging-over');
        dropZone.appendChild(clonedElement);
        this.hasClonedTable = true;
      } else {
        console.error('Zone cible introuvable ou non valide.');
      }
    }
  }
}