
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../services/api.service';
import { ImageRenderComponent } from '../image-render/image-render.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="fas fa-plus"></i>',
      createButtonContent: '<i class="fas fa-check"></i>',
      cancelButtonContent: '<i class="fas fa-times"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fas fa-edit"></i>',
      saveButtonContent: '<i class="fas fa-check"></i>',
      cancelButtonContent: '<i class="fas fa-times"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      photo: {
        title: 'Image',
        type: 'custom',
        renderComponent: ImageRenderComponent,
        filter: false,
        editable: true,
        addable: true,
        valuePrepareFunction: (value: any) => {
          return value ? value : 'assets/user.jpg'; 
        }
      },
      
      nom: {
        title: 'Nom Complet',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
      },
          
      departement: {
        title: 'Département',
        type: 'string',
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'IT', title: 'IT' },
              { value: 'PRODUCTION', title: 'PRODUCTION' },
            ],
          },
        },
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
              { value: 'ADMINISTRATEUR', title: 'Administrateur' },
              { value: 'CHEF_DE_PROJET', title: 'Chef de projet' },
              { value: 'DESIGNER', title: 'designer' },
              { value: 'DEVELOPPEUR', title: 'Développeur' },
              { value: 'CLIENT', title: 'client' },

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
    const query = this.searchQuery.toLowerCase();
  
    // Applique un filtre sur tous les champs disponibles
    this.source.setFilter([
      { field: 'nom', search: query },
      { field: 'username', search: query },
      { field: 'password', search: query },
      { field: 'departement', search: query },
      { field: 'poste', search: query },
      { field: 'role', search: query },
      { field: 'photo', search: query }
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