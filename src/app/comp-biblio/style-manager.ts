export class StyleManager {
  static updateStyle(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    styleName: string,
    value: string
  ): void {
    if (selectedStyles && selectedClone) {
      selectedStyles[styleName] = value;
      this.updateComponentStyles(selectedClone, selectedStyles);
    }
  }

  static updateComponentStyles(
    selectedClone: HTMLElement | null,
    selectedStyles: any
  ): void {
    if (selectedClone) {
      const clonedElement = selectedClone.querySelector(
        '.draggable'
      ) as HTMLElement;
      if (clonedElement) {
        Object.assign(clonedElement.style, selectedStyles);
      }
    }
  }

  static onInputChange(
    style: string,
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateStyle(selectedStyles, selectedClone, style, value);
  }

  static onTextAlignChange(
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'textAlign',
        target.value
      );
    }
  }

  static onFontFamilyChange(
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'fontFamily',
        target.value
      );
    }
  }

  static onFontSizeChange(
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      const fontSizeValue = target.value + 'px'; // Ajoute l'unité 'px' à la valeur
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'fontSize',
        fontSizeValue
      );
    }
  }

  static onChangeColor(
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    styleName: string
  ): void {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      this.updateStyle(selectedStyles, selectedClone, styleName, target.value);
    }
  }

  static toggleBold(
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    this.updateStyle(
      selectedStyles,
      selectedClone,
      'fontWeight',
      selectedStyles.fontWeight === 'bold' ? 'normal' : 'bold'
    );
  }

  static toggleItalic(
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    this.updateStyle(
      selectedStyles,
      selectedClone,
      'fontStyle',
      selectedStyles.fontStyle === 'italic' ? 'normal' : 'italic'
    );
  }

  static moveForward(selectedClone: HTMLElement | null): void {
    if (selectedClone) {
      selectedClone.style.zIndex = `${
        parseInt(selectedClone.style.zIndex || '0') + 1
      }`;
    }
  }

  static moveToFront(selectedClone: HTMLElement | null): void {
    if (selectedClone) {
      selectedClone.style.zIndex = '9999';
    }
  }

  static moveBackward(selectedClone: HTMLElement | null): void {
    if (selectedClone) {
      selectedClone.style.zIndex = `${
        parseInt(selectedClone.style.zIndex || '0') - 1
      }`;
    }
  }

  static moveToBack(selectedClone: HTMLElement | null): void {
    if (selectedClone) {
      selectedClone.style.zIndex = '1';
    }
  }

  static setBorder(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    borderType: string
  ): void {
    let borderValue = '';
    switch (borderType) {
      case 'none':
        borderValue = 'none';
        break;
      case 'solid':
        borderValue = '1px solid black';
        break;
      case 'dashed':
        borderValue = '1px dashed black';
        break;
      default:
        borderValue = 'none';
    }
    this.updateStyle(selectedStyles, selectedClone, 'border', borderValue);
  }

  static setCorner(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    cornerType: string
  ): void {
    let borderRadiusValue = '';
    switch (cornerType) {
      case 'sharp':
        borderRadiusValue = '0';
        break;
      case 'hard':
        borderRadiusValue = '2px';
        break;
      case 'rounded':
        borderRadiusValue = '5px';
        break;
      case 'soft':
        borderRadiusValue = '10px';
        break;
      case 'circular':
        borderRadiusValue = '50%';
        break;
      default:
        borderRadiusValue = '0';
    }
    this.updateStyle(
      selectedStyles,
      selectedClone,
      'borderRadius',
      borderRadiusValue
    );
  }

  static setShadow(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    shadowType: string
  ): void {
    let boxShadowValue = '';
    switch (shadowType) {
      case 'none':
        boxShadowValue = 'none';
        break;
      case 'soft':
        boxShadowValue = '0 2px 5px rgba(0,0,0,0.1)';
        break;
      case 'regular':
        boxShadowValue = '0 4px 8px rgba(0,0,0,0.2)';
        break;
      case 'hard':
        boxShadowValue = '0 6px 12px rgba(0,0,0,0.3)';
        break;
      case 'retro':
        boxShadowValue = '5px 5px 0 rgba(0,0,0,0.2)';
        break;
      default:
        boxShadowValue = 'none';
    }
    this.updateStyle(
      selectedStyles,
      selectedClone,
      'boxShadow',
      boxShadowValue
    );
  }

  static setBorderWidth(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    width: string
  ): void {
    if (selectedStyles && selectedClone) {
      const currentBorder = selectedStyles.border || '1px solid black';
      const newBorder = currentBorder.replace(/\d+px/, width);
      this.updateStyle(selectedStyles, selectedClone, 'border', newBorder);
    }
  }

  static onChangeBackground(
    event: Event,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const target = event.target as HTMLInputElement;
    if (target?.value) {
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'backgroundColor',
        target.value
      );
    }
  }

  
  static setOpacity(
    value: number,
    selectedStyles: any,
    selectedClone: HTMLElement | null
  ): void {
    const opacity = Math.max(0, Math.min(1, value / 100));
    this.updateStyle(
      selectedStyles,
      selectedClone,
      'opacity',
      opacity.toString()
    );
  }
  static setSize(
    selectedStyles: any,
    selectedClone: HTMLElement | null,
    size: 'XS' | 'S' | 'M' | 'L' | 'XL'
  ): void {
    if (!selectedStyles || !selectedClone) return;
  
    const sizeValue = StyleManager.getSizeValue(size);
    const icon = selectedClone.querySelector('i');
    
    if (icon) {
      icon.style.fontSize = sizeValue;
      icon.style.width = sizeValue;
      icon.style.height = sizeValue;
    }
  
    // Met à jour les styles sélectionnés
    selectedStyles.iconSize = size;
    selectedStyles.fontSize = sizeValue;
  }
  static getSizeValue(size: 'XS' | 'S' | 'M' | 'L' | 'XL'): string {
    const sizeMap: Record<'XS' | 'S' | 'M' | 'L' | 'XL', string> = {
      'XS': '16px',
      'S': '24px',
      'M': '32px',
      'L': '48px',
      'XL': '64px'
    };
    return sizeMap[size];
  }


  static addIcon(iconName: string, selectedStyles: any, selectedClone: HTMLElement | null): void {
    if (!selectedClone) return;
  
    // Vérifier s'il y a déjà une icône
    let iconElement = selectedClone.querySelector('i');
  
    if (!iconElement) {
      // Création de l'élément <i> pour l'icône
      iconElement = document.createElement('i');
      iconElement.className = 'iconify'; // Ajoute la classe pour Iconify ou autre lib d'icônes
      iconElement.setAttribute('data-icon', iconName);
      iconElement.style.fontSize = '16px';
  
      // Création d'un conteneur pour bien structurer le bouton
      let wrapper = document.createElement('span');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '8px';
  
      // Déplacer le texte du bouton dans le wrapper
      while (selectedClone.firstChild) {
        wrapper.appendChild(selectedClone.firstChild);
      }
  
      // Ajouter l'icône et le texte dans le wrapper
      wrapper.prepend(iconElement);
  
      // Ajouter le wrapper dans le bouton
      selectedClone.appendChild(wrapper);
    } else {
      iconElement.setAttribute('data-icon', iconName);
    }
  
    // Mise à jour des styles
    selectedStyles.icon = iconName;
  }
  
  

  
  
  
}



