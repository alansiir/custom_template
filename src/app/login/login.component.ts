import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importez le service Router


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder , private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Formulaire soumis :', this.loginForm.value);
      // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
      // Simulez une validation réussie et redirigez vers la page Home
      this.router.navigate(['/home']); // Utilisez navigate pour rediriger
    }
  }
}