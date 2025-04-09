import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentUser: any = {};
  searchQuery: string = '';  // Variable pour la recherche

  filteredUsers = [...this.users];

  constructor(private apiService: ApiService) { }


  ngOnInit() {
    this.loadUsers();
  }
  
  // Charger tous les utilisateurs
  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...data]; // Initialise filteredUsers
      },
      error: (error) => console.error('Erreur:', error)
    });
  }
    // Créer ou mettre à jour un utilisateur
    saveUser() {
      if (this.currentUser.id) {
        this.apiService.updateUser(this.currentUser.id, this.currentUser).subscribe(
          () => this.loadUsers()
        );
      } else {
        this.apiService.createUser(this.currentUser).subscribe(
          () => this.loadUsers()
        );
      }
      this.currentUser = {}; // Réinitialiser le formulaire
    }
    // Éditer un utilisateur
  editUser(user: any) {
    this.currentUser = {...user};
  }

  deleteUser(id: number) {
    this.apiService.deleteUser(id).subscribe(
      () => this.loadUsers()
    );}


  search() {
    // Filtrer les utilisateurs en fonction de la recherche
    if (this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.departement.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.poste.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  } 
}


