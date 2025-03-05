import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-comp-biblio',
  templateUrl: './comp-biblio.component.html',
  styleUrls: ['./comp-biblio.component.scss']
})
export class CompBiblioComponent {
  @ViewChild('menuContainer') menuContainer!: ElementRef;

  // Liste des éléments du menu
  menuItems = [
    { label: 'Template', icon: 'mdi:layers-outline' },
    { label: 'Shape', icon: 'mdi:shape' },
    { label: 'Text', icon: 'mdi:format-text' },
    { label: 'Image', icon: 'mdi:image-outline' },
    { label: 'Icon', icon: 'mdi:emoticon-outline' },
    { label: 'Button', icon: 'mdi:gesture-tap-button' },
    { label: 'Form', icon: 'mdi:form-select' }
  ];
  
 componentsData = [
  { type: 'Template', label: 'table',component: 'app-table-comp',
    styles: { zoom: '0.3' }},

  { type: 'Button', label: 'button',component: 'button',
    styles: { width: '150px' } },

  {  type: 'Shape', label: 'circle',component: 'div',
    styles: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgb(146, 146, 146)' }
  },

  {type: 'Shape', label: 'rectangle', component: 'div',
  styles: { width: '100px', height: '50px', backgroundColor: 'rgb(146, 146, 146)' }
  },

  { type: 'Shape', label: 'rounded rectangle',component: 'div',
    styles: { width: '100px', height: '50px', borderRadius: '15px', backgroundColor: 'rgb(146, 146, 146)' }
  },

  { type: 'Shape',  label: 'horizontal line', component: 'div',
    styles: { width: '100px', height: '2px', backgroundColor: 'rgb(146, 146, 146)' }
  },

  { type: 'Shape', label: 'vertical line', component: 'div',
    styles: { width: '2px', height: '50px', backgroundColor: 'rgb(146, 146, 146)' }
  },

  { type: 'Text', label: 'text', component: 'p',
    styles: { fontSize: '16px', color: 'black' }  }];



  isModalOpen = false;
  selectedItem: any = null;
  hasClonedTable = false;
  searchQuery: string = ''; // Propriété pour stocker la requête de recherche
  filteredComponentsData: any[] = []; // Liste des composants filtrés
  //searchResults: any[] = []; // Résultats de la recherche
  constructor() {
    this.filteredComponentsData = this.componentsData; // Initialiser avec tous les éléments
  }

  // Filtrer les éléments en fonction de la requête de recherche  // Méthode pour filtrer les composants en fonction de la recherche
  filterComponents(): void {
    const lowerCaseQuery = this.searchQuery.toLowerCase();
  
    // Filtrer d'abord par texte de recherche
    let filteredBySearch = this.componentsData;
    if (this.searchQuery) {
      filteredBySearch = this.componentsData.filter(component =>
        component.label.toLowerCase().includes(lowerCaseQuery)
      );
  
      // Vérifier si un élément correspondant est trouvé dans une autre catégorie
      const matchingItem = this.componentsData.find(component =>
        component.label.toLowerCase().includes(lowerCaseQuery)
      );
  
      if (matchingItem && this.selectedItem?.label !== matchingItem.type) {
        // Mettre à jour la catégorie sélectionnée
        this.selectedItem = this.menuItems.find(item => item.label === matchingItem.type);
      }
    }
  
    // Ensuite, filtrer par catégorie sélectionnée (si applicable)
    if (this.selectedItem) {
      this.filteredComponentsData = filteredBySearch.filter(component =>
        component.type === this.selectedItem.label
      );
    } else {
      this.filteredComponentsData = filteredBySearch;
    }
  
    console.log('Selected Item:', this.selectedItem);
    console.log('Search Query:', this.searchQuery);
    console.log('Filtered Components:', this.filteredComponentsData);
  }



  // Faire défiler vers la gauche
  scrollLeft() {
    this.menuContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
  }

  // Faire défiler vers la droite
  scrollRight() {
    this.menuContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
  }

  // Faire défiler jusqu'à l'élément sélectionné
  scrollToSelectedItem(): void {
    if (this.selectedItem) {
      const container = this.menuContainer.nativeElement;
      const selectedButton = container.querySelector(`.menu-items.active`);

      if (selectedButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = selectedButton.getBoundingClientRect();

        // Calculer le décalage nécessaire pour centrer l'élément
        const scrollOffset = buttonRect.left - containerRect.left - (containerRect.width / 2) + (buttonRect.width / 2);

        // Faire défiler jusqu'à la position calculée
        container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
      }
    }
  }

  // Ouvrir la modale
  // openModal(item: any): void {
  //   if (this.isModalOpen) {
  //     this.selectedItem = item;
  //   } else {
  //     this.selectedItem = item;
  //     this.isModalOpen = true;
  //   }
  //   console.log('Modal ouvert ?', this.isModalOpen, 'Item sélectionné :', this.selectedItem);

  //   // Faire défiler jusqu'à l'élément sélectionné
  //   this.scrollToSelectedItem();
  //   this.filterComponents(); // Appliquer le filtre lors de l'ouverture de la modale
  // }
  openModal(item: any): void {
    this.selectedItem = item;
    this.isModalOpen = true;
    this.filterComponents(); // Appliquer le filtre après la sélection
    this.scrollToSelectedItem();
  }

  // Fermer la modale
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
    this.searchQuery = ''; // Réinitialiser la recherche
    this.filterComponents(); // Réinitialiser les éléments filtrés
  }

  // Démarrer le glisser-déposer
  startDrag(event: DragEvent): void {
    if (event.dataTransfer && event.target) {
      const target = event.target as HTMLElement;
      event.dataTransfer.setData('text/plain', target.id);
      target.classList.add('dragging');
    }
  }

  // Gérer le survol pendant le glisser-déposer
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
      dropZone.classList.add('dragging-over');
    }
  }

  // Gérer le dépôt d'un élément
  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer) {
      const itemId = event.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(itemId);

      if (!draggedElement) {
        console.error(`Élément avec l'ID "${itemId}" introuvable.`);
        return;
      }

      // Cloner l'élément
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