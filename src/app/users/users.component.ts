
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i> Ajouter',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      nom: {
        title: 'Nom',
        type: 'string',
      },
      prenom: {
        title: 'Prénom',
        type: 'string',
      },
      departement: {
        title: 'Département',
        type: 'string',
      },
      poste: {
        title: 'Poste',
        type: 'string',
      },
      role: {
        title: 'Rôle',
        type: 'string',
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'DEVELOPPEUR', title: 'Développeur' },
              { value: 'ADMINISTRATEUR', title: 'Administrateur' }
            ],
          },
        },
      }
    }
  };

  source = new LocalDataSource();
  searchQuery: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.source.load(data);
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  search() {
    this.source.setFilter([
      { field: 'nom', search: this.searchQuery },
      { field: 'prenom', search: this.searchQuery },
      { field: 'departement', search: this.searchQuery },
      { field: 'poste', search: this.searchQuery },
      { field: 'role', search: this.searchQuery }
    ], false);
  }

  onCreateConfirm(event: any) {
    this.apiService.createUser(event.newData).subscribe({
      next: () => event.confirm.resolve(),
      error: () => event.confirm.reject()
    });
  }

  onEditConfirm(event: any) {
    this.apiService.updateUser(event.data.id, event.newData).subscribe({
      next: () => event.confirm.resolve(),
      error: () => event.confirm.reject()
    });
  }

  onDeleteConfirm(event: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.apiService.deleteUser(event.data.id).subscribe({
        next: () => event.confirm.resolve(),
        error: () => event.confirm.reject()
      });
    } else {
      event.confirm.reject();
    }
  }
}