import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
 
} from '@angular/core';
import { componentsData } from './components-data';
import { menuItems } from './menuItems-data';
import { StyleManager } from './style-manager';
import { ResizeManager } from './resize-manager';

@Component({
  selector: 'app-comp-biblio',
  templateUrl: './comp-biblio.component.html',
  styleUrls: ['./comp-biblio.component.scss'],
})
export class CompBiblioComponent implements OnInit  {
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
  selectedFile: File | null = null;
uploadError: string | null = null;
  opacityValue = 100;
  // Ajoutez cette propriété à votre classe
readonly iconSizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[] = ['XS', 'S', 'M', 'L', 'XL'];


  constructor() {
    this.filteredComponentsData = this.componentsData;
  }

  ngOnInit(): void {
 // this.loadFromLocalStorage();
    // this.loadFromLocalStorage(); // Charger les éléments sauvegardés
    document.addEventListener('click', (event: MouseEvent) => {
      this.handleDocumentClick(event);
    });
    this.testLocalStorageCapacity();

  }

  private testLocalStorageCapacity(): void {
    try {
      const testData = new Array(1000).fill('test').join('');
      localStorage.setItem('capacityTest', testData);
      console.log('Test de capacité réussi');
      localStorage.removeItem('capacityTest');
    } catch (e) {
      console.warn('Capacité limitée du localStorage:', e);
    }
  }
  ngOnChanges() {
    if (this.selectedComponent) {
      this.selectedStyles = this.selectedComponent.styles || {};
    }
  }


  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const settingSection = document.querySelector('.setting');
    if (
      this.selectedClone &&
      !this.selectedClone.contains(event.target as Node)
    ) {
      if (!settingSection?.contains(event.target as Node)) {
        this.deselectAllComponents(); // Appeler la méthode pour désélectionner
      }
    }
  }

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
    // this.saveToLocalStorage(); // Sauvegarder après la suppression

  }

  // Vérifier s'il reste des clones dans la drop-zone
  checkForClonedTables(): boolean {
    const dropZone = document.querySelector('.drop-zone');
    return dropZone
      ? dropZone.querySelectorAll('.cloned-table').length > 0
      : false;
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
        this.selectedItem = this.menuItems.find(
          (item) => item.label === matchingItem.type
        );
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

  scrollLeft(): void {
    this.menuContainer.nativeElement.scrollBy({
      left: -100,
      behavior: 'smooth',
    });
  }
  scrollRight(): void {
    this.menuContainer.nativeElement.scrollBy({
      left: 100,
      behavior: 'smooth',
    });
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

  startDrag(event: DragEvent): void {
    if (event.dataTransfer && event.target) {
      const target = event.target as HTMLElement;
      const componentType = target.getAttribute('data-component-type');
      const componentLabel = target.getAttribute('data-component-label');
      const icon = target.querySelector('i')?.getAttribute('data-icon');

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
      dropZone.classList.add('dragging-over');
    }
  }

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
        originalComponent = this.filteredComponentsData.find(
          (comp) => comp.component === 'app-table-comp'
        );
      } else {
        // Logique pour les autres composants
        const index = parseInt(id.replace('draggable-', ''), 10); // Extraire l'index de l'ID
        originalComponent = this.filteredComponentsData[index];
      }

      // Vérifier que le composant existe et a une propriété `styles`
      if (!originalComponent || !originalComponent.styles) {
        console.error(
          "Composant d'origine introuvable ou propriété `styles` manquante."
        );
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
      // 🔥 Ajouter la classe pour la bordure
      container.classList.add('selected-clone');

      // Ajouter des poignées de redimensionnement à la div parente
      // this.addResizeHandles(container);
      ResizeManager.addResizeHandles(container);

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
        console.log('Déplacement en cours...');
        const dropZone = document.querySelector('.drop-zone') as HTMLElement;
        if (!dropZone) return;
        const dropZoneRect = dropZone.getBoundingClientRect();
        let x = e.clientX - dropZoneRect.left - offsetX;
        let y = e.clientY - dropZoneRect.top - offsetY;
        x = Math.max(
          0,
          Math.min(x, dropZoneRect.width - container.offsetWidth)
        );
        y = Math.max(
          0,
          Math.min(y, dropZoneRect.height - container.offsetHeight)
        );
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
      }
    }
    // this.saveToLocalStorage(); // Sauvegarder après avoir ajouté un clone

  }

  selectComponent(container: HTMLElement): void {
    console.log('Élément sélectionné :', container);
    if (!container) {
      console.error('Aucun conteneur sélectionné.');
      return;
    }

    // Désélectionner tous les autres clones
    this.deselectAllComponents();

    // Ajouter l'outline pour la bordure
    container.style.outline = '1px solid #007bff'; // Bordure bleue

    // Mettre à jour les références
    this.selectedClone = container;
    this.selectedComponent = (container as any).originalComponent;
    this.selectedStyles = { ...this.selectedComponent.styles };

    console.log('Clone sélectionné avec outline :', this.selectedClone);
  }
  deselectAllComponents(): void {
    // Récupérer tous les clones
    const selectedClones = document.querySelectorAll('.clone-container');

    // Convertir la NodeList en tableau et parcourir chaque clone
    Array.from(selectedClones).forEach((clone) => {
      if (clone) {
        // Vérifier que clone existe
        const htmlElement = clone as HTMLElement; // Convertir en HTMLElement
        htmlElement.style.outline = 'none'; // Retirer l'outline
      }
    });

    // Réinitialiser les références
    this.selectedClone = null;
    this.selectedComponent = null;
    this.selectedStyles = {};
  }

  getDynamicStyles(component: any) {
    const width = parseInt(component.styles.width, 10);
    const height = parseInt(component.styles.height, 10);
    const borderRadius = parseInt(component.styles.borderRadius, 10);
    const fontSize = parseInt(component.styles.fontSize, 10);
    const backgroundColor = parseInt(component.styles.backgroundColor, 10);

    let newWidth,
      newHeight,
      newZoom,
      newBorderRadius = borderRadius / 2;

    let newFontSize = fontSize / 2;
    
    let newBackgroundColor = '#FFF';
    
    
    if (width > height) {
      newWidth = 100;
      newHeight = (height / width) * 100;
      //newZoom = 0.06 ;
      
    } else {
      newHeight = 100;
      newWidth = (width / height) * 100;
      //newZoom = 0.06;
    }

    return {
      ...component.styles,
      height: `${newHeight}%`,
      width: `${newWidth}%`,
      borderRadius: `${newBorderRadius}px`,
      fontSize: `${newFontSize}px`,
    //  zoom: `${newZoom}`,
      backgroundColor: `${newBackgroundColor}`,
    };
  }
  onInputChange(style: string, event: Event): void {
    StyleManager.onInputChange(
      style,
      event,
      this.selectedStyles,
      this.selectedClone
    );
    // this.saveToLocalStorage(); // Sauvegarder après avoir modifié un style

  }
  onTextAlignChange(event: Event): void {
    StyleManager.onTextAlignChange(
      event,
      this.selectedStyles,
      this.selectedClone
    );
  }
  onFontFamilyChange(event: Event): void {
    StyleManager.onFontFamilyChange(
      event,
      this.selectedStyles,
      this.selectedClone
    );
  }
  onFontSizeChange(event: Event): void {
    StyleManager.onFontSizeChange(
      event,
      this.selectedStyles,
      this.selectedClone
    );
  }
  toggleBold(): void {
    StyleManager.toggleBold(this.selectedStyles, this.selectedClone);
  }
  toggleItalic(): void {
    StyleManager.toggleItalic(this.selectedStyles, this.selectedClone);
  }
  moveForward(): void {
    StyleManager.moveForward(this.selectedClone);
  }
  moveToFront(): void {
    StyleManager.moveToFront(this.selectedClone);
  }
  moveBackward(): void {
    StyleManager.moveBackward(this.selectedClone);
  }
  moveToBack(): void {
    StyleManager.moveToBack(this.selectedClone);
  }
  onChangeColor(event: Event, styleName: string): void {
    StyleManager.onChangeColor(
      event,
      this.selectedStyles,
      this.selectedClone,
      styleName
    );
  }
  // Méthodes uniques
  setBorder(borderType: string): void {
    StyleManager.setBorder(this.selectedStyles, this.selectedClone, borderType);
  }
  setBorderWidth(event: Event): void {
    const width = (event.target as HTMLSelectElement).value;
    StyleManager.setBorderWidth(this.selectedStyles, this.selectedClone, width);
  }

  setCorner(cornerType: string): void {
    StyleManager.setCorner(this.selectedStyles, this.selectedClone, cornerType);
  }

  setShadow(shadowType: string): void {
    StyleManager.setShadow(this.selectedStyles, this.selectedClone, shadowType);
  }

  onChangeBackground(event: Event): void {
    StyleManager.onChangeBackground(
      event,
      this.selectedStyles,
      this.selectedClone
    );
  }

  onOpacityChange(value: number): void {
    this.opacityValue = value;
    StyleManager.setOpacity(value, this.selectedStyles, this.selectedClone);
  }


async onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  this.selectedFile = input.files[0];
  
  try {
    // 1. Lire le fichier
    const imageUrl = await this.readFileAsDataURL(this.selectedFile);
    
    // 2. Mettre à jour le composant sélectionné ET la source dans componentsData
    const selectedIndex = this.componentsData.findIndex(c => c === this.selectedComponent);
    if (selectedIndex > -1) {
      // Mise à jour dans le tableau original
      this.componentsData[selectedIndex].src = imageUrl;
      
      // Forcer la détection des changements
      this.componentsData = [...this.componentsData];
    }
    
    // 3. Mettre à jour les styles
    this.updateStyles();
    
  } catch (error) {
    console.error('Upload failed:', error);
    // Gestion d'erreur
  }
}

private readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject('File read error');
    reader.readAsDataURL(file);
  });
}

updateStyles(): void {
  if (this.selectedComponent && this.selectedClone) {
    // Mettre à jour à la fois le composant et les styles
    Object.assign(this.selectedComponent.styles, this.selectedStyles);
    StyleManager.updateComponentStyles(this.selectedClone, this.selectedStyles);
  }
}



// Ajoutez cette méthode helper à StyleManager
isIconComponent(): boolean {
  return this.selectedComponent?.component === 'i' || 
         this.selectedComponent?.type === 'Icon';
}
onSizeChange(size: 'XS' | 'S' | 'M' | 'L' | 'XL'): void {
  if (!this.selectedComponent || !this.selectedStyles) return;

  // Applique la taille via StyleManager
  StyleManager.setSize(
    this.selectedStyles,
    this.selectedClone,
    size
  );

  // Met à jour les styles du composant
  this.selectedComponent.styles = {
    ...this.selectedComponent.styles,
    iconSize: size,
    fontSize: StyleManager.getSizeValue(size)
  };

  // Force la mise à jour de l'affichage
  this.updateStyles();
}

addIconToSelected(iconName: string): void {
  if (this.selectedClone) {
    StyleManager.addIcon(iconName, this.selectedStyles, this.selectedClone);
  }
}

// saveToLocalStorage(): void {
//   const dropZone = document.querySelector('.drop-zone');
//   if (!dropZone) return;

//   const clones = Array.from(dropZone.querySelectorAll('.clone-container')).map((clone) => {
//     const element = clone as HTMLElement;
//     const content = element.firstElementChild as HTMLElement;
//     const original = (element as any).originalComponent || {};

//     // Sauvegarder le type spécifique et les propriétés
//     const savedItem: any = {
//       id: element.id || `clone-${Date.now()}`,
//       type: original.type,
//       label: original.label,
//       component: original.component,
//       styles: {},
//       position: {
//         left: element.style.left,
//         top: element.style.top
//       },
//       attributes: original.attributes || {},
//       content: original.content || content.innerHTML
//     };

//     // Sauvegarder les styles selon le type
//     switch (original.type) {
//       case 'Template':
//         savedItem.templateType = original.label.toLowerCase();
//         savedItem.styles = this.cloneStyles(content.style);
//         break;
        
//       case 'Image':
//         savedItem.imgSrc = original.src || content.querySelector('img')?.src;
//         savedItem.styles = this.cloneStyles(content.style);
//         break;
        
//       case 'Icon':
//         savedItem.icon = original.icon;
//         savedItem.styles = { 
//           fontSize: content.style.fontSize,
//           color: content.style.color 
//         };
//         break;
        
//       default:
//         savedItem.styles = this.cloneStyles(content.style);
//     }

//     return savedItem;
//   });

//   localStorage.setItem('savedComponents', JSON.stringify(clones));
// }

// private cloneStyles(style: CSSStyleDeclaration): any {
//   const styles: any = {};
//   for (let i = 0; i < style.length; i++) {
//     const prop = style[i];
//     styles[prop] = style.getPropertyValue(prop);
//   }
//   return styles;
// }

// loadFromLocalStorage(): void {
//   const savedData = localStorage.getItem('savedComponents');
//   if (!savedData) return;

//   try {
//     const savedComponents = JSON.parse(savedData);
//     const dropZone = document.querySelector('.drop-zone');
//     if (!dropZone) return;

//     dropZone.innerHTML = '';

//     savedComponents.forEach((comp: any) => {
//       const container = document.createElement('div');
//       container.className = 'clone-container';
//       container.id = comp.id;
//       container.style.position = 'absolute';
//       container.style.left = comp.position.left || '0px';
//       container.style.top = comp.position.top || '0px';

//       // Créer le contenu selon le type
//       let content: HTMLElement;
//       switch (comp.type) {
//         case 'Template':
//           content = this.restoreTemplate(comp);
//           break;
          
//         case 'Button':
//           content = this.restoreButton(comp);
//           break;
          
//         case 'Shape':
//           content = this.restoreShape(comp);
//           break;
          
//         case 'Text':
//           content = this.restoreText(comp);
//           break;
          
//         case 'Image':
//           content = this.restoreImage(comp);
//           break;
          
//         case 'Icon':
//           content = this.restoreIcon(comp);
//           break;
          
//         case 'Form':
//           content = this.restoreFormElement(comp);
//           break;
          
//         default:
//           content = document.createElement('div');
//           content.innerHTML = comp.content || '';
//       }

//       // Appliquer les styles
//       Object.keys(comp.styles).forEach(prop => {
//         content.style[prop as any] = comp.styles[prop];
//       });

//       container.appendChild(content);
//       this.setupDragHandlers(container);
//       this.addRemoveButton(container);
//       dropZone.appendChild(container);
//     });
//   } catch (error) {
//     console.error('Error loading from localStorage:', error);
//   }
// }
// private restoreTemplate(comp: any): HTMLElement {
//   const template = document.createElement(comp.component);
  
//   // Gestion spéciale pour les templates complexes
//   switch (comp.templateType) {
//     case 'navbar':
//       return this.restoreNavbar(comp);
//     case 'sidebar':
//       return this.restoreSidebar(comp);
//     case 'footer':
//       return this.restoreFooter(comp);
   
//     default:
//       if (comp.content) {
//         template.innerHTML = comp.content;
//       }
//       return template;
//   }
// }

// private restoreNavbar(comp: any): HTMLElement {
//   const nav = document.createElement('nav');
//   nav.innerHTML = `
//     <div class="logo">SAFRAN</div>
//     <ul class="nav-links">
//       <li><a href="#">Services</a></li>
//       <li><a href="#">Projects</a></li>
//       <li><a href="#">Profile</a></li>
//     </ul>
//   `;
//   return nav;
// }

// private restoreSidebar(comp: any): HTMLElement {
//   const aside = document.createElement('aside');
//   aside.innerHTML = `
//     <ul class="sidebar-menu">
//       <li><a href="#">Home</a></li>
//       <li><a href="#">Dashboard</a></li>
//       <li><a href="#">Settings</a></li>
//     </ul>
//   `;
//   return aside;
// }

// private restoreButton(comp: any): HTMLButtonElement {
//   const button = document.createElement('button');
//   button.textContent = comp.label;
//   button.className = 'restored-button';
//   return button;
// }

// private restoreShape(comp: any): HTMLElement {
//   const shape = document.createElement('div');
//   shape.className = `shape ${comp.label.toLowerCase().replace(' ', '-')}`;
//   return shape;
// }

// private restoreImage(comp: any): HTMLElement {
//   const container = document.createElement('div');
//   const img = document.createElement('img');
//   img.src = comp.imgSrc || 'assets/default-image.png';
//   img.alt = comp.label;
//   container.appendChild(img);
//   return container;
// }

// private restoreIcon(comp: any): HTMLElement {
//   const icon = document.createElement('i');
//   icon.className = 'iconify';
//   icon.setAttribute('data-icon', comp.icon);
//   return icon;
// }

// private restoreFormElement(comp: any): HTMLElement {
//   let element: HTMLElement;
  
//   switch (comp.component) {
//     case 'input-text':
//       element = document.createElement('input');
//       element.setAttribute('type', 'text');
//       break;
//     case 'input-checkbox':
//       element = document.createElement('input');
//       element.setAttribute('type', 'checkbox');
//       break;
//     case 'input-radio':
//       element = document.createElement('input');
//       element.setAttribute('type', 'radio');
//       break;
//     case 'input-slider':
//       element = document.createElement('input');
//       element.setAttribute('type', 'range');
//       break;
//     default:
//       element = document.createElement('div');
//   }

//   // Appliquer les attributs
//   Object.keys(comp.attributes || {}).forEach(attr => {
//     element.setAttribute(attr, comp.attributes[attr]);
//   });

//   return element;
// }


// private addRemoveButton(container: HTMLElement): void {
//   const removeBtn = document.createElement('button');
//   removeBtn.className = 'remove-btn';
//   removeBtn.textContent = '×';
//   removeBtn.addEventListener('click', (e) => {
//     e.stopPropagation();
//     container.remove();
//     this.saveToLocalStorage();
//   });
//   container.appendChild(removeBtn);
// }

// private setupDragHandlers(element: HTMLElement): void {
//   let isDragging = false;
//   let offsetX = 0;
//   let offsetY = 0;

//   // Mouse Down Handler
//   element.addEventListener('mousedown', (e: MouseEvent) => {
//     if (e.button !== 0) return; // Only left mouse button
//     if ((e.target as HTMLElement).classList.contains('remove-btn')) return;

//     isDragging = true;
//     const rect = element.getBoundingClientRect();
//     offsetX = e.clientX - rect.left;
//     offsetY = e.clientY - rect.top;
    
//     element.style.cursor = 'grabbing';
//     element.style.zIndex = '100'; // Bring to front when dragging
    
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   });

//   const onMouseMove = (e: MouseEvent) => {
//     if (!isDragging) return;
    
//     const dropZone = document.querySelector('.drop-zone');
//     if (!dropZone) return;
    
//     const dropZoneRect = dropZone.getBoundingClientRect();
//     let x = e.clientX - dropZoneRect.left - offsetX;
//     let y = e.clientY - dropZoneRect.top - offsetY;
    
//     // Boundary checks
//     x = Math.max(0, Math.min(x, dropZoneRect.width - element.offsetWidth));
//     y = Math.max(0, Math.min(y, dropZoneRect.height - element.offsetHeight));
    
//     element.style.left = `${x}px`;
//     element.style.top = `${y}px`;
//   };

//   const onMouseUp = () => {
//     isDragging = false;
//     element.style.cursor = 'move';
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
    
//     // Save new position
//     this.saveToLocalStorage();
//   };

// }

// private restoreText(comp: any): HTMLElement {
//   const textElement = document.createElement(comp.component || 'p');
//   textElement.textContent = comp.content || comp.label || '';
//   textElement.className = 'restored-text';
//   return textElement;
// }
// private restoreFooter(comp: any): HTMLElement {
//   const footer = document.createElement('footer');
//   footer.innerHTML = `
//     <div class="footer-content">
//       ${comp.content?.[0]?.content || '© 2025 Safran. Tous droits réservés.'}
//     </div>
//   `;
//   footer.className = 'restored-footer';
//   return footer;
// }





}
