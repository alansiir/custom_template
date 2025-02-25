import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  canGoBack = false;
  canGoForward = false;
  zoomLevel = 100; // Niveau de zoom initial

  goHome() {
    console.log('Retour à l’accueil');
  }

  goBack() {
    console.log('Retour en arrière');
    this.canGoBack = false; // Simuler une action
  }

  goForward() {
    console.log('Avancer');
    this.canGoForward = false; // Simuler une action
  }

  zoomIn() {
    if (this.zoomLevel < 200) {
      this.zoomLevel += 10;
      this.applyZoom();
    }
  }

  zoomOut() {
    if (this.zoomLevel > 50) {
      this.zoomLevel -= 10;
      this.applyZoom();
    }
  }

  applyZoom() {
    document.documentElement.style.setProperty('--zoom-scale', `${this.zoomLevel / 100}`);
    console.log(`Zoom: ${this.zoomLevel}%`);
  }

  share() {
    console.log('Partager');
  }

  export() {
    console.log('Exporter');
  }

  preview() {
    console.log('Aperçu');
  }

  // Détecter le scroll de la souris pour zoomer
  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (event.ctrlKey) { // Active le zoom seulement si CTRL est pressé
      event.preventDefault();
      if (event.deltaY < 0) {
        this.zoomIn(); // Scroll haut = zoom avant
      } else {
        this.zoomOut(); // Scroll bas = zoom arrière
      }
    }
  }
}
