
import { Component, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-fixed-user-circle',
  templateUrl: './fixed-user-circle.component.html',
  styleUrls: ['./fixed-user-circle.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', 
          style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class FixedUserCircleComponent {
  @Input() isSidenavCollapsed = false;
  showMenu = false;

  // Mock user data - à remplacer par votre service utilisateur
  user = {
    name: 'Ala Nsir',
    photo: null, // ou 'assets/images/user.jpg'
    role: 'Dev'
  };

  constructor(private router: Router) {}

  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  toggleUserMenu(): void {
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-circle-fixed')) {
      this.showMenu = false;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.showMenu = false;
  }

  logout(): void {
    // Implémentez votre logique de déconnexion
    console.log('Déconnexion');
    this.showMenu = false;
  }
}
