// import { Component, OnInit, Output ,EventEmitter, HostListener } from '@angular/core';
// import { navbarData } from './nav-data';

// export interface SideNavToggle{
//   screenWidth: number;
//   collapsed : boolean;
// }

// @Component({
//   selector: 'app-sidenav2',
//   templateUrl: './sidenav2.component.html',
//   styleUrls: ['./sidenav2.component.scss']
// })
// export class Sidenav2Component implements OnInit {
//   @Output() onToggleSidNav: EventEmitter<SideNavToggle> = new EventEmitter
//   //  l'enfant vers le parent
//   screenWidth  = 0;
//   collapsed: boolean = false;
//   navData = navbarData;

//   constructor() {}

//   @HostListener('window:resize',['$event'])
//   onResize(event:any){
//  this.screenWidth = window.innerWidth;
//  if(this.screenWidth<= 768){
//   this.collapsed = false;
//   this.onToggleSidNav.emit({collapsed : this.collapsed , screenWidth: this.screenWidth});

//  }
//   }
//   ngOnInit(): void {
//     console.log('Valeur initiale de collapsed:', this.collapsed);
//     this.screenWidth =window.innerWidth;  
//   }

//   toggleCollapse() {
//     this.collapsed = !this.collapsed;
//     console.log('État de collapsed après clic :', this.collapsed);
//     this.onToggleSidNav.emit({collapsed : this.collapsed , screenWidth: this.screenWidth});
//   }

//   closeSidenav() {
//     this.collapsed = false;
//     this.onToggleSidNav.emit({collapsed : this.collapsed , screenWidth: this.screenWidth});

//   }
// }

import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { navbarData } from './nav-data';

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.scss']
})
export class Sidenav2Component implements OnInit {
  @Output() onToggleSidNav: EventEmitter<SideNavToggle> = new EventEmitter(); // Ajoutez des parenthèses ici

  screenWidth = 0;
  collapsed = false;
  navData = navbarData;

  constructor() {}

  ngOnInit(): void {
    console.log('Valeur initiale de collapsed:', this.collapsed);
    this.updateScreenWidth(); // Appel initial de la méthode pour initialiser screenWidth
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateScreenWidth(); // Mettez à jour screenWidth lors du redimensionnement
  }

  private updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
    console.log('Largeur de l\'écran mise à jour :', this.screenWidth);

    // Si la largeur de l'écran est inférieure ou égale à 768px, fermez automatiquement le menu
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSidNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    console.log('État de collapsed après clic :', this.collapsed);
    this.onToggleSidNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSidNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
}