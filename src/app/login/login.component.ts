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
      this.authService.login(this.username, this.password).subscribe(
        (response) => {
          // Si la réponse est valide, rediriger l'utilisateur
          this.router.navigate(['/projects']);
        },
        (error) => {
          // Si l'authentification échoue, afficher l'erreur
          this.showError = true;
        }
      );
    }
  }
}
