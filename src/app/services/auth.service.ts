import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Récupérer l'utilisateur depuis le localStorage au démarrage
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // public updateCurrentUser(user: any): void {
  //   this.currentUserSubject.next(user);
  //   //localStorage.setItem('currentUser', JSON.stringify(user));
  // }
  updateCurrentUser(userData: any): void {
    // Mettre à jour le BehaviorSubject ou le stockage local
    this.currentUserSubject.next(userData);
    
    // Optionnel: sauvegarder dans le localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
    login(username: string, password: string): Observable<any> {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
    
      return this.http.post<any>(`${this.apiUrl}/login`, formData).pipe(
        tap((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
    }
    
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }


  changePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { 
      userId, 
      newPassword 
    });
  }
}