// resize-manager.ts
export class ResizeManager {
  // Ajouter des poignées de redimensionnement
  static addResizeHandles(container: HTMLElement): void {
    const resizeHandlePositions = [
      'top',
      'bottom',
      'left',
      'right', // Milieux des côtés
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right', // Coins
    ];

    resizeHandlePositions.forEach((position) => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${position}`;
      handle.style.position = 'absolute';
      handle.style.width = '8px';
      handle.style.height = '8px';
      handle.style.backgroundColor = '#258eff';
      handle.style.border = '1px solid blue';
      handle.style.borderRadius = '50%';
      handle.style.cursor = `${position}-resize`;
      handle.style.opacity = '0';
      handle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      // Positionnement de la poignée
      switch (position) {
        case 'top':
          handle.style.top = '-5px';
          handle.style.left = '50%';
          handle.style.transform = 'translateX(-50%)';
          handle.style.cursor = 'n-resize';
          break;
        case 'bottom':
          handle.style.bottom = '-5px';
          handle.style.left = '50%';
          handle.style.transform = 'translateX(-50%)';
          handle.style.cursor = 's-resize';
          break;
        case 'left':
          handle.style.left = '-5px';
          handle.style.top = '50%';
          handle.style.transform = 'translateY(-50%)';
          handle.style.cursor = 'w-resize';
          break;
        case 'right':
          handle.style.right = '-5px';
          handle.style.top = '50%';
          handle.style.transform = 'translateY(-50%)';
          handle.style.cursor = 'e-resize';
          break;
        case 'top-left':
          handle.style.top = '-5px';
          handle.style.left = '-5px';
          handle.style.cursor = 'nw-resize';
          break;
        case 'top-right':
          handle.style.top = '-5px';
          handle.style.right = '-5px';
          handle.style.cursor = 'ne-resize';
          break;
        case 'bottom-left':
          handle.style.bottom = '-5px';
          handle.style.left = '-5px';
          handle.style.cursor = 'sw-resize';
          break;
        case 'bottom-right':
          handle.style.bottom = '-5px';
          handle.style.right = '-5px';
          handle.style.cursor = 'se-resize';
          break;
      }

      // Gestion du clic sur la poignée
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        ResizeManager.startResize(e, container, position);
      });

      container.appendChild(handle);
    });

    // Afficher les poignées lors du survol
    container.addEventListener('mouseenter', () => {
      const handles = container.querySelectorAll('.resize-handle');
      handles.forEach((handle) => {
        (handle as HTMLElement).style.opacity = '1';
        (handle as HTMLElement).style.transform += ' scale(1.2)';
      });
    });

    // Masquer les poignées lorsque la souris quitte l'élément
    container.addEventListener('mouseleave', () => {
      const handles = container.querySelectorAll('.resize-handle');
      handles.forEach((handle) => {
        (handle as HTMLElement).style.opacity = '0';
        (handle as HTMLElement).style.transform = 'scale(1)';
      });
    });
  }

  // Démarrer le redimensionnement
  static startResize(
    event: MouseEvent,
    container: HTMLElement,
    position: string
  ): void {
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = container.offsetWidth;
    const startHeight = container.offsetHeight;
    const startLeft = container.offsetLeft;
    const startTop = container.offsetTop;

    const minWidth = 15;
    const minHeight = 15;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch (position) {
        case 'top':
          newHeight = Math.max(minHeight, startHeight - deltaY);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 'bottom':
          newHeight = Math.max(minHeight, startHeight + deltaY);
          break;
        case 'left':
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newLeft = startLeft + (startWidth - newWidth);
          break;
        case 'right':
          newWidth = Math.max(minWidth, startWidth + deltaX);
          break;
        case 'top-left':
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newHeight = Math.max(minHeight, startHeight - deltaY);
          newLeft = startLeft + (startWidth - newWidth);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 'top-right':
          newWidth = Math.max(minWidth, startWidth + deltaX);
          newHeight = Math.max(minHeight, startHeight - deltaY);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 'bottom-left':
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newHeight = Math.max(minHeight, startHeight + deltaY);
          newLeft = startLeft + (startWidth - newWidth);
          break;
        case 'bottom-right':
          newWidth = Math.max(minWidth, startWidth + deltaX);
          newHeight = Math.max(minHeight, startHeight + deltaY);
          break;
      }

      container.style.width = `${newWidth}px`;
      container.style.height = `${newHeight}px`;
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;

      const clonedElement = container.querySelector(
        '.draggable'
      ) as HTMLElement;
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
}
