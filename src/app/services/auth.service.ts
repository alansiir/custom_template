import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    // Récupérer l'utilisateur depuis le localStorage au démarrage
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  updateCurrentUser(userData: any): void {
    this.currentUserSubject.next(userData);
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
    return this.http.post(`${this.apiUrl}/change-password`, null, {
        params: { userId: userId.toString(), newPassword }
    });
}
}