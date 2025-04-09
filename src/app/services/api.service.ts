import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/users'; // Correspond à votre @RequestMapping

  constructor(private http: HttpClient) { }

  // Créer un utilisateur
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Récupérer un utilisateur par ID
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un utilisateur
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}