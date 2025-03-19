export class StyleManager {

    static updateStyle(selectedStyles: any, selectedClone: HTMLElement | null, styleName: string, value: string): void {
      if (selectedStyles && selectedClone) {
        selectedStyles[styleName] = value;
        this.updateComponentStyles(selectedClone, selectedStyles);
      }
    }

    static updateComponentStyles(selectedClone: HTMLElement | null, selectedStyles: any): void {
      if (selectedClone) {
        const clonedElement = selectedClone.querySelector('.draggable') as HTMLElement;
        if (clonedElement) {
          Object.assign(clonedElement.style, selectedStyles);
        }
      }
    }

    static onInputChange(style: string, event: Event, selectedStyles: any, selectedClone: HTMLElement | null): void {
      const value = (event.target as HTMLInputElement).value;
      this.updateStyle(selectedStyles, selectedClone, style, value);
    }

    static onTextAlignChange(event: Event, selectedStyles: any, selectedClone: HTMLElement | null): void {
      const target = event.target as HTMLSelectElement;
      if (target) {
        this.updateStyle(selectedStyles, selectedClone, 'textAlign', target.value);
      }
    }

    static onFontFamilyChange(event: Event, selectedStyles: any, selectedClone: HTMLElement | null): void {
      const target = event.target as HTMLSelectElement;
      if (target) {
        this.updateStyle(selectedStyles, selectedClone, 'fontFamily', target.value);
      }
    }

    static onFontSizeChange(event: Event, selectedStyles: any, selectedClone: HTMLElement | null): void {
        const target = event.target as HTMLInputElement;
        if (target && target.value) {
          const fontSizeValue = target.value + 'px'; // Ajoute l'unité 'px' à la valeur
          this.updateStyle(selectedStyles, selectedClone, 'fontSize', fontSizeValue);
        }
      }

    // static changeColor(selectedStyles: any, selectedClone: HTMLElement | null, colorType: 'color' | 'backgroundColor', colorValue: string): void {
    //     this.updateStyle(selectedStyles, selectedClone, colorType, colorValue);
    //   }
    static onChangeColor(event: Event, selectedStyles: any, selectedClone: HTMLElement | null, styleName: string): void {
        const target = event.target as HTMLInputElement;
        if (target && target.value) {
          this.updateStyle(selectedStyles, selectedClone, styleName, target.value);
        }
      }

    static toggleBold(selectedStyles: any, selectedClone: HTMLElement | null): void {
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'fontWeight',
        selectedStyles.fontWeight === 'bold' ? 'normal' : 'bold'
      );
    }
  
    static toggleItalic(selectedStyles: any, selectedClone: HTMLElement | null): void {
      this.updateStyle(
        selectedStyles,
        selectedClone,
        'fontStyle',
        selectedStyles.fontStyle === 'italic' ? 'normal' : 'italic'
      );
    }

    
    static moveForward(selectedClone: HTMLElement | null): void {
      if (selectedClone) {
        selectedClone.style.zIndex = `${parseInt(selectedClone.style.zIndex || '0') + 1}`;
      }
    }
  
    static moveToFront(selectedClone: HTMLElement | null): void {
      if (selectedClone) {
        selectedClone.style.zIndex = '9999';
      }
    }
  
    
    static moveBackward(selectedClone: HTMLElement | null): void {
      if (selectedClone) {
        selectedClone.style.zIndex = `${parseInt(selectedClone.style.zIndex || '0') - 1}`;
      }
    }
  
    static moveToBack(selectedClone: HTMLElement | null): void {
      if (selectedClone) {
        selectedClone.style.zIndex = '1';
      }
    }
  }