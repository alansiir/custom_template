import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onLogin(event: Event) {
    event.preventDefault(); // pour empêcher le rechargement
    this.showError = false;

    // Auth fake simple
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['/projects']);
    } else {
      // Si c'est une tentative incorrecte, essaie l'API
      this.authService.login(this.username, this.password).subscribe({
        next: (user) => {
          console.log('Utilisateur connecté:', user);
          this.router.navigate(['/projects']); // Redirection après succès
        },
        error: (err) => {
          console.error('Erreur d’authentification :', err);
          this.showError = true;
        }
      }) 
    }
  }
}
