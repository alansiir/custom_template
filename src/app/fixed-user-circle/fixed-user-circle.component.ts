import { Component, Input, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';

interface AppUser {
  id?: number;
  name: string;
  photo?: string | null;
  role?: string;
}

@Component({
  selector: 'app-fixed-user-circle',
  templateUrl: './fixed-user-circle.component.html',
  styleUrls: ['./fixed-user-circle.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class FixedUserCircleComponent implements OnInit {
  @Input() isSidenavCollapsed = false;
  showMenu = false;
  user: AppUser = { name: 'Invité', photo: null, role: 'Visiteur' };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.updateUserData(user);
      } else {
        this.resetUser();
      }
    });
  }

  private loadCurrentUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.updateUserData(currentUser);
    }
  }

  private updateUserData(userData: any): void {
    this.user = {
      id: userData.id,
      name: userData.nom || userData.username || 'Utilisateur',
      photo: this.getUserPhotoUrl(userData),
      role: userData.role || 'Utilisateur'
    };
  }

  private getUserPhotoUrl(user: any): string | null {
    if (!user?.photo) return null;
    
    if (user.photo.startsWith('http') || user.photo.startsWith('data:')) {
      return user.photo;
    }
    
    if (user.id) {
      return `http://localhost:8080/api/users/${user.id}/photo?t=${Date.now()}`;
    }
    
    return null;
  }

  private resetUser(): void {
    this.user = { name: 'Invité', photo: null, role: 'Visiteur' };
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
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
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur de déconnexion:', err);
      }
    });
  }
}