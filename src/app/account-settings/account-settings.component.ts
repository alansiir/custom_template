import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

interface UserProfileResponse {
  id: number;
  nom: string;
  photo?: string;
  departement?: string;
  poste?: string;
}

@Component({  
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {
  newPassword = '';
  repeatPassword = '';
  passwordMismatch = false;
  passwordStrength = '';
  nom = '';
  profilePhoto: File | null = null;
  profilePhotoUrl: string | ArrayBuffer | null = null;
 // currentUser: any = null;
 currentUser = {
  id: 1 // Remplace ça par l'ID dynamique si tu en as un
};

  constructor(
    private authService: AuthService, 
    private router: Router,
    private apiService: ApiService // Correction: 'apiService' avec minuscule
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.nom = user.nom;
        if (user.photo) {
          this.loadUserPhoto(user.id);
        }
      }
    });
  }

  loadUserPhoto(userId: number): void {
    this.apiService.getUserPhoto(userId).subscribe(blob => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(blob);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profilePhoto = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.profilePhoto);
    }
  }

 
  onChangePassword(): void {
    // Vérification initiale
    if (!this.newPassword || !this.repeatPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    this.passwordMismatch = this.newPassword !== this.repeatPassword;
    this.checkPasswordStrength(this.newPassword);
  
    if (this.passwordMismatch) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
  
    if (this.passwordStrength === 'too weak') {
      alert('Le mot de passe est trop faible');
      return;
    }
  
    if (!this.currentUser?.id) {
      console.error('Aucun utilisateur connecté ou ID manquant');
      return;
    }
  
    this.authService.changePassword(this.currentUser.id, this.newPassword).subscribe({
      next: (response: any) => {
        console.log('Mot de passe changé avec succès', response);
        alert('Mot de passe changé avec succès!');
        this.newPassword = '';
        this.repeatPassword = '';
        this.passwordStrength = '';
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du changement de mot de passe', error);
        alert(`Erreur: ${error.error?.message || error.message}`);
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }

  checkPasswordStrength(password: string): void {
    if (password.length < 6) {
      this.passwordStrength = 'too weak';
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      this.passwordStrength = 'strong';
    } else {
      this.passwordStrength = 'medium';
    }
  }

  onProfileUpdate(): void {
    if (!this.currentUser?.id) {
      console.error('User ID is missing');
      return;
    }
  
    const formData = new FormData();
    formData.append('nom', this.nom);
    
    if (this.profilePhoto) {
      formData.append('photo', this.profilePhoto);
    }
  
    this.apiService.updateUserProfile(this.currentUser.id, { nom: this.nom, photo: this.profilePhoto }).subscribe({
      next: (response) => {
        console.log('Update successful', response);
        // Mettre à jour l'utilisateur dans le service d'authentification
        const updatedUser = { ...this.currentUser, nom: this.nom };
        this.authService.updateCurrentUser(updatedUser);
        alert('Profil mis à jour avec succès!');
      },
      error: (error) => {
        console.error('Update error', error);
        alert(`Erreur lors de la mise à jour: ${error.error?.message || error.message}`);
      }
    });
  }
}