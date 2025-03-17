  import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
  import { componentsData } from './components-data';
  import {menuItems} from './menuItems-data';

  @Component({
    selector: 'app-comp-biblio',
    templateUrl: './comp-biblio.component.html',
    styleUrls: ['./comp-biblio.component.scss'],
  })
  export class CompBiblioComponent implements OnInit {  
    @ViewChild('menuContainer') menuContainer!: ElementRef; 
    componentsData = componentsData;
    menuItems = menuItems;
    isModalOpen = false;
    selectedItem: any = null;
    hasClonedTable = false;
    searchQuery: string = '';
    filteredComponentsData: any[] = [];
    selectedComponent: any = null;
    selectedClone: HTMLElement | null = null;
    selectedStyles: any = {};

    constructor() {
      this.filteredComponentsData = this.componentsData;
    }

    ngOnInit(): void {
      // Écouter les clics sur le document entier
      document.addEventListener('click', (event: MouseEvent) => {
        this.handleDocumentClick(event);
      });
    }

    getObjectKeys(obj: any): string[] {
      return Object.keys(obj);
    }

    onInputChange(style: string, event: Event): void {
      const value = (event.target as HTMLInputElement).value;
      this.updateStyle(style, value);
    }
    handleDocumentClick(event: MouseEvent): void {
      const settingSection = document.querySelector('.setting');
      if (this.selectedClone && !this.selectedClone.contains(event.target as Node)) {
        if (!settingSection?.contains(event.target as Node)) {
          this.deselectAllComponents();
        }
      }
    }

    // Désélectionner tous les composants
    deselectAllComponents(): void {
      const selectedComponents = document.querySelectorAll('.selected-component');
      selectedComponents.forEach(comp => comp.classList.remove('selected-component'));
      this.selectedClone = null; // Réinitialiser la référence du composant sélectionné
      this.selectedComponent = null; // Réinitialiser la référence au composant d'origine
      this.selectedStyles = {}; // Réinitialiser les styles sélectionnés
    }

    // Sélectionner un composant
    selectComponent(container: HTMLElement): void {
      console.log('Élément sélectionné :', container);
      if (!container) {
        console.error('Aucun conteneur sélectionné.');
        return;
      }
      this.deselectAllComponents(); // Désélectionner tout d'abord
      container.classList.add('selected-component');
      this.selectedClone = container; // Mettre à jour la référence du composant sélectionné
      this.selectedComponent = (container as any).originalComponent;
      this.selectedStyles = { ...this.selectedComponent.styles };
      console.log('Élément sélectionné :', container);
    }

    // Mettre à jour les styles du composant cloné
    updateComponentStyles(): void {
      if (this.selectedClone && this.selectedComponent) {
        const clonedElement = this.selectedClone.querySelector('.draggable') as HTMLElement;
        if (clonedElement) {
          Object.assign(clonedElement.style, this.selectedStyles);
        }
      }
    }

    // Écouter la touche Échap
    @HostListener('document:keydown', ['$event'])
    handleEscapeKey(event: KeyboardEvent): void {
      if (event.key === 'Delete' && this.selectedClone) {
        this.removeSelectedClone();
      }
    }

    removeSelectedClone(): void {
      if (this.selectedClone) {
        this.selectedClone.remove(); // Supprimer le clone
        this.selectedClone = null; // Réinitialiser la référence du clone sélectionné
        this.selectedComponent = null; // Réinitialiser la référence au composant d'origine
        this.selectedStyles = {}; // Réinitialiser les styles sélectionnés
        this.hasClonedTable = this.checkForClonedTables(); // Vérifier s'il reste des clones
      }
    }

    // Vérifier s'il reste des clones dans la drop-zone
    checkForClonedTables(): boolean {
      const dropZone = document.querySelector('.drop-zone');
      return dropZone ? dropZone.querySelectorAll('.cloned-table').length > 0 : false;
    }

    // Filtrer les composants en fonction de la recherche
    filterComponents(): void {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      let filteredBySearch = this.componentsData;
      if (this.searchQuery) {
        filteredBySearch = this.componentsData.filter((component) =>
          component.label.toLowerCase().includes(lowerCaseQuery)
        );
        const matchingItem = this.componentsData.find((component) =>
          component.label.toLowerCase().includes(lowerCaseQuery)
        );
        if (matchingItem && this.selectedItem?.label !== matchingItem.type) {
          this.selectedItem = this.menuItems.find((item) => item.label === matchingItem.type);
        }
      }
      if (this.selectedItem) {
        this.filteredComponentsData = filteredBySearch.filter(
          (component) => component.type === this.selectedItem.label
        );
      } else {
        this.filteredComponentsData = filteredBySearch;
      }
    }

    // Faire défiler vers la gauche
    scrollLeft(): void {
      this.menuContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
    }

    // Faire défiler vers la droite
    scrollRight(): void {
      this.menuContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
    }

    scrollToSelectedItem(): void {
      if (this.selectedItem) {
        const container = this.menuContainer.nativeElement;
        const selectedButton = container.querySelector(`.menu-items.active`);
        if (selectedButton) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = selectedButton.getBoundingClientRect();
          const scrollOffset =
            buttonRect.left -
            containerRect.left -
            containerRect.width / 2 +
            buttonRect.width / 2;
          container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
      }
    }
    // Ouvrir la modale
    openModal(item: any): void {
      this.selectedItem = item;
      this.isModalOpen = true;
      this.filterComponents();
      this.scrollToSelectedItem();
    }

    // Fermer la modale
    closeModal(): void {
      this.isModalOpen = false;
      this.selectedItem = null;
      this.searchQuery = '';
      this.filterComponents();
    }

    // Faire défiler jusqu'à l'élément sélectionné
   

    // Démarrer le glisser-déposer
    startDrag(event: DragEvent): void {
      if (event.dataTransfer && event.target) {
        const target = event.target as HTMLElement;
        const componentType = target.getAttribute('data-component-type');
        const componentLabel = target.getAttribute('data-component-label');
        const icon = target.querySelector('i')?.getAttribute('data-icon');
    
        // Vérifie que l'ID est correctement généré
        console.log('ID généré:', target.id);
    
        event.dataTransfer.setData(
          'text/plain',
          JSON.stringify({
            id: target.id,
            type: componentType,
            label: componentLabel,
            icon: icon,
          })
        );
        target.classList.add('dragging');
      }
    }

    onDragOver(event: DragEvent): void {
      event.preventDefault();
      const dropZone = document.querySelector('.drop-zone');
      if (dropZone) {
        dropZone.classList.add('dragging-over');  }}
        onDrop(event: DragEvent): void {
          event.preventDefault(); // Empêcher le comportement par défaut du navigateur
      
          if (event.dataTransfer) {
              // Extraire les données du drag and drop
              const data = JSON.parse(event.dataTransfer.getData('text/plain'));
              const { id, type, label, icon } = data;
              let clonedElement: HTMLElement;
      
              // Trouver le composant d'origine dans filteredComponentsData
              let originalComponent;
              if (id.startsWith('table-')) {
                  // Logique spécifique pour le composant table
                  originalComponent = this.filteredComponentsData.find(comp => comp.component === 'app-table-comp');
              } else {
                  // Logique pour les autres composants
                  const index = parseInt(id.replace('draggable-', ''), 10); // Extraire l'index de l'ID
                  originalComponent = this.filteredComponentsData[index];
              }
      
              // Vérifier que le composant existe et a une propriété `styles`
              if (!originalComponent || !originalComponent.styles) {
                  console.error('Composant d\'origine introuvable ou propriété `styles` manquante.');
                  return;
              }
      
              // Créer un clone du composant
              if (type === 'Icon') {
                  // Logique pour les icônes
                  clonedElement = document.createElement('div');
                  clonedElement.className = 'icon-container';
                  clonedElement.style.position = 'absolute';
                  clonedElement.style.pointerEvents = 'auto';
                  const iconElement = document.createElement('i');
                  iconElement.className = 'iconify';
                  iconElement.setAttribute('data-icon', icon);
                  iconElement.style.fontSize = '24px';
                  iconElement.style.color = 'black';
                  clonedElement.appendChild(iconElement);
                  const labelElement = document.createElement('span');
                  labelElement.className = 'style-name';
                  labelElement.textContent = label;
                  clonedElement.appendChild(labelElement);
              } else {
                  // Logique pour les autres composants (y compris le tableau)
                  const draggedElement = document.getElementById(id);
                  if (!draggedElement) {
                      console.error(`Élément avec l'ID "${id}" introuvable.`);
                      return;
                  }
                  clonedElement = draggedElement.cloneNode(true) as HTMLElement;
                  // Appliquer les styles de l'élément d'origine
                  Object.assign(clonedElement.style, originalComponent.styles);
              }
      
              // Créer une div parente pour le clone
              const container = document.createElement('div');
              container.className = 'clone-container';
              container.style.position = 'absolute';
              container.style.cursor = 'move';
              container.appendChild(clonedElement);
      
              // Ajouter des poignées de redimensionnement à la div parente
              this.addResizeHandles(container);
      
              // Stocker une référence au composant d'origine
              (container as any).originalComponent = originalComponent;
      
              // Ajouter un bouton de suppression
              const removeButton = document.createElement('button');
              removeButton.className = 'remove-btn';
              removeButton.textContent = '❌';
              removeButton.addEventListener('click', () => {
                  this.removeSelectedClone(); // Appeler la méthode pour supprimer et désélectionner
              });
              container.appendChild(removeButton);
      
              // Gestion du déplacement interne
              let isDraggingInternally = false;
              let offsetX = 0;
              let offsetY = 0;
      
              container.addEventListener('mousedown', (e: MouseEvent) => {
                  // Vérifier si l'utilisateur a cliqué sur une poignée de redimensionnement
                      if (e.button !== 0) return; // Seulement le bouton gauche

                  if ((e.target as HTMLElement).classList.contains('resize-handle')) {
                      return; // Ne pas déclencher le déplacement si c'est une poignée de redimensionnement
                  }
      
                  isDraggingInternally = true;
                  const rect = container.getBoundingClientRect();
                  offsetX = e.clientX - rect.left;
                  offsetY = e.clientY - rect.top;
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                  this.selectComponent(container);
              });
      
              const onMouseMove = (e: MouseEvent) => {
                  if (!isDraggingInternally) return;
                  const dropZone = document.querySelector('.drop-zone') as HTMLElement;
                  if (!dropZone) return;
                  const dropZoneRect = dropZone.getBoundingClientRect();
                  let x = e.clientX - dropZoneRect.left - offsetX;
                  let y = e.clientY - dropZoneRect.top - offsetY;
                  x = Math.max(0, Math.min(x, dropZoneRect.width - container.offsetWidth));
                  y = Math.max(0, Math.min(y, dropZoneRect.height - container.offsetHeight));
                  container.style.left = `${x}px`;
                  container.style.top = `${y}px`;
              };
      
              const onMouseUp = () => {
                  isDraggingInternally = false;
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
              };
      
              // Ajouter le clone à la zone cible (drop-zone)
              const dropZone = document.querySelector('.drop-zone');
              if (dropZone && dropZone instanceof HTMLElement) {
                  dropZone.classList.remove('dragging-over');
                  dropZone.appendChild(container);
                  this.hasClonedTable = true;
      
                  // Centrer le clone dans la drop-zone
                  const dropZoneRect = dropZone.getBoundingClientRect();
                  const centerX = (dropZoneRect.width - container.offsetWidth) / 2;
                  const centerY = (dropZoneRect.height - container.offsetHeight) / 2;
                  container.style.left = `${centerX}px`;
                  container.style.top = `${centerY}px`;
              } else {
                  console.error('Zone cible introuvable ou non valide.');
              }
          }
      
          // Log pour déboguer l'événement de drop
          console.log('Drop event triggered for:', event.dataTransfer?.getData('text/plain'));
      }
      

  addResizeHandles(container: HTMLElement): void {
    const resizeHandlePositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    resizeHandlePositions.forEach(position => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${position}`;
      handle.style.position = 'absolute';
      handle.style.width = '8px'; // Taille légèrement augmentée
      handle.style.height = '8px';
      handle.style.backgroundColor = '#258eff'; // Transparent par défaut
      // handle.style.border = '1px solid blue'; // Bordure visible
      handle.style.borderRadius = '50%'; // Forme circulaire
      handle.style.cursor = `${position}-resize`;
      handle.style.opacity = '0'; // Invisible par défaut
      handle.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; // Animation
      switch (position) {
        case 'bottom-right':
          handle.style.cursor = 'se-resize';
          handle.style.bottom = '-5px';
          handle.style.right = '-5px';
          break;
        case 'bottom-left':
          handle.style.cursor = 'sw-resize';
          handle.style.bottom = '-5px';
          handle.style.left = '-5px';
          break;
        case 'top-right':
          handle.style.cursor = 'ne-resize';
          handle.style.top = '-5px';
          handle.style.right = '-5px';
          break;
        case 'top-left':
          handle.style.cursor = 'nw-resize';
          handle.style.top = '-5px';
          handle.style.left = '-5px';
          break;
      }
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.startResize(e, container, position);
      });
      container.appendChild(handle);
    });

    // Afficher les poignées lors du survol
    container.addEventListener('mouseenter', () => {
      const handles = container.querySelectorAll('.resize-handle');
      handles.forEach(handle => {
        (handle as HTMLElement).style.opacity = '1';
        (handle as HTMLElement).style.transform = 'scale(1.2)'; // Légère augmentation de taille
      });
    });

    // Masquer les poignées lorsque la souris quitte le conteneur
    container.addEventListener('mouseleave', () => {
      const handles = container.querySelectorAll('.resize-handle');
      handles.forEach(handle => {
        (handle as HTMLElement).style.opacity = '0';
        (handle as HTMLElement).style.transform = 'scale(1)';
      });
    });
  }
    startResize(event: MouseEvent, container: HTMLElement, position: string): void {
      event.stopPropagation();
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = container.offsetWidth;
      const startHeight = container.offsetHeight;
      const startLeft = container.offsetLeft;
      const startTop = container.offsetTop;
    
      const minWidth = 10; // Largeur minimale
      const minHeight = 10; // Hauteur minimale
    
      const onMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
    
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
    
        switch (position) {
          case 'bottom-right':
            newWidth = Math.max(minWidth, startWidth + deltaX);
            newHeight = Math.max(minHeight, startHeight + deltaY);
            break;
          case 'bottom-left':
            newWidth = Math.max(minWidth, startWidth - deltaX);
            newHeight = Math.max(minHeight, startHeight + deltaY);
            newLeft = startLeft + (startWidth - newWidth); // Ajuster la position pour rester fixe
            break;
          case 'top-right':
            newWidth = Math.max(minWidth, startWidth + deltaX);
            newHeight = Math.max(minHeight, startHeight - deltaY);
            newTop = startTop + (startHeight - newHeight); // Ajuster la position pour rester fixe
            break;
          case 'top-left':
            newWidth = Math.max(minWidth, startWidth - deltaX);
            newHeight = Math.max(minHeight, startHeight - deltaY);
            newLeft = startLeft + (startWidth - newWidth); // Ajuster la position pour rester fixe
            newTop = startTop + (startHeight - newHeight); // Ajuster la position pour rester fixe
            break;
        }
          container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
        const clonedElement = container.querySelector('.draggable') as HTMLElement;
        if (clonedElement) {
          clonedElement.style.width = `${newWidth}px`;
          clonedElement.style.height = `${newHeight}px`;
        }
      };
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    updateStyle(styleName: string, value: string): void {
      if (this.selectedStyles && this.selectedClone) {
        this.selectedStyles[styleName] = value;
        this.updateComponentStyles();
      }}}
