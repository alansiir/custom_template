import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showError: boolean = false;

  constructor(private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault(); // pour empêcher le rechargement
    this.showError = false;
    // Auth fake simple
    if (this.username === 'admin' && this.password === 'admin') {
      this.router.navigate(['/projects']);
    } else {
      this.showError = true; 
    }
  }
}
