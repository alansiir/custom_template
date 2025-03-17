import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectionStrategy, inject, Input, Injector, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import Iconify from '@iconify/iconify';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { BadgeComponent } from '../badge/badge.component';


export interface TableData {
  firstName: string;
  lastName: string;
  birthdayDate: string;
  age: string;
  status: string;
  [key: string]: any;  // Permet d'accéder aux propriétés dynamiquement
  selected?: boolean;
  editing?: boolean;
  isNew?: boolean;
}

interface Column {
  component?: any;
  title: string;
  type: string;
  show: boolean;
  filter: boolean;  // pour savoir si le filtre est activé
  filterText: string; // pour stocker le texte du filtre
}

@Component({
  selector: 'app-table-comp',
  templateUrl: './table-comp.component.html',
  styleUrls: ['./table-comp.component.scss'],
})

export class TableCompComponent implements OnInit {
 id = 'table-component'


  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogDetails') dialogDetails!: TemplateRef<any>;
  // @ViewChild('badgeContainer', { read: ViewContainerRef }) badgeContainer!: ViewContainerRef;

  @Input() data: TableData[] = [
    { firstName: 'Wajdi', lastName: 'Ch', birthdayDate: '06-07-1991', age: '33', status: 'Marié', custom: 'info', editing: false, selected: false },
    { firstName: 'Ala', lastName: 'Nsir', birthdayDate: '21-02-1991', age: '34', status: 'Marié', custom: 'warning', editing: false, selected: false },
    { firstName: 'Bilel', lastName: 'Sbouri', birthdayDate: '15-09-1997', age: '28', status: 'Celébataire', custom: 'warning', editing: false, selected: false },
    { firstName: 'Wajdi', lastName: 'Sbouri', birthdayDate: '15-09-1997', age: '28', status: 'Marié', custom: 'info', editing: false, selected: false },

  ];

  selectAll: boolean = false;
  filter: boolean = false;
  paginatedData: TableData[] = [];
  originalData: any[] = []; // Stocke toutes les données
  searchText: string = '';
  filterText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedRow: TableData | null = null;
  dialogRef: any;
  eyeData: any;
  selectAllColumns: boolean = true;
  addRowActive: boolean = false;
  toppings!: FormGroup;

  keepOrder = (a: any, b: any): number => 0;

  @Input() settings = {
    actions: {
      active: false,
      title: 'Actions',
      view: true,
      edit: true,
      delete: true,
      add: true,
      pdf: true,
      excel: true,
      csv: true,
      import: true,
      settings: true,
    },

    columns: {
      firstName: {
        title: 'Nom',
        type: 'string',
        show: true,
        filter: false,
        filterText: '',
      },

      lastName: {
        title: 'Prénom',
        type: 'string',
        show: true,
        filter: false,
        filterText: '',
      },

      birthdayDate: {
        title: 'Date d\'anniversaire',
        type: 'date',
        show: true,
        filter: false,
        filterText: '',
      },

      age: {
        title: 'Âge',
        type: 'number',
        show: true,
        filter: false,
        filterText: '',
      },

      custom: {
        title: 'Custom',
        type: 'component',
        show: true,
        filter: false,
        filterText: '',
        // component: BadgeComponent
      },

      status: {
        title: 'Statut',
        type: 'string',
        show: true,
        filter: false,
        filterText: '',
        badge: {
          célibataire: 'green',
          marié: 'red',
        },
      },
    } as Record<string, Column>,

    itemsPerPage: 10,
  };

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, 
  ) {
    this.updatePagination();
    this.initializeForm();
  }

  initializeForm(): void {
    let controls: Record<string, any> = {}; // Solution 3: Type explicite pour éviter l'erreur TS7053

    Object.keys(this.settings.columns).forEach(key => {
      controls[key] = [this.settings.columns[key].show || false];
    });

    this.toppings = this._formBuilder.group(controls);
  }

  submitForm(): void {
    console.log('Form Values:', this.toppings.value);
  }

  ngOnInit() {
    Iconify.scan(); // Scanner les icônes dans le DOM
    this.originalData = [...this.data]; // Initialise les données
    this.updatePagination();
  }

  // 🔹 Met à jour l'affichage des colonnes en fonction des cases cochées dans le modal
  updateColumnVisibility() {
    Object.keys(this.settings.columns).forEach(colKey => {
      this.settings.columns[colKey].show = this.toppings.get(colKey)?.value;
    });
  }

  isRowFilled(row: any): boolean {
    return Object.keys(row).some(key => key !== 'selected' && key !== 'editing' && key !== 'error' && row[key]);
  }

  clearInput() {
    this.searchText = ''; // Vide l'input
    this.filterText = '';
    this.originalData = [...this.data];
    this.updatePagination();
    this.applyColumnFilter();
    this.applyFilter();
  }

  applyFilter() {
    const filtered = this.data.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
    this.originalData = filtered;
    this.updatePagination();
    this.applyColumnFilter()
  }

  applyColumnFilter() {
    this.paginatedData = this.originalData.filter(row => {
      return Object.keys(this.settings.columns).every(colKey => {
        const column = this.settings.columns[colKey];
        const filterText = column.filterText ? column.filterText.toLowerCase() : '';
        const cellValue = row[colKey] ? row[colKey].toString().toLowerCase() : '';

        // Vérifie si la colonne a un filtre actif et si la valeur contient le texte recherché
        return filterText === '' || cellValue.includes(filterText);
      });
    });

    this.originalData = this.paginatedData;
    this.updatePagination();
  }

  clearAllFilters() {
    // Réinitialiser tous les champs de filtre dans settings.columns
    Object.keys(this.settings.columns).forEach(colKey => {
      this.settings.columns[colKey].filterText = ''; // Supprime le texte du filtre
      this.settings.columns[colKey].filter = false; // Supprime le texte du filtre
    });

    // Réinitialiser l'affichage du tableau avec toutes les données originales
    this.originalData = [...this.data];
    this.updatePagination(); // Met à jour la pagination
  }

  // Fonction pour activer/désactiver le filtre
  toggleFilter(columnKey: string): void {
    this.settings.columns[columnKey].filter = !this.settings.columns[columnKey].filter;
    if (!this.settings.columns[columnKey].filter) {
      this.settings.columns[columnKey].filterText = '';  // Réinitialiser le texte du filtre
    }

    this.clearInput();
  }

  toggleSelectAllColumns() {
    this.selectAllColumns = !this.selectAllColumns; // Inverser l'état

    // Appliquer la sélection/désélection à toutes les colonnes
    Object.keys(this.settings.columns).forEach(colKey => {
      this.settings.columns[colKey].show = this.selectAllColumns;
    });
  }



  changeItemsPerPage() {
    this.totalPages = Math.ceil(this.originalData.length / this.itemsPerPage); // Recalculer le total des pages
    this.currentPage = 1; // Revenir à la première page pour éviter les erreurs
    this.paginateData();
  }

  // addRow() {
  //   this.originalData.unshift({ firstName: '', lastName: '', birthdayDate: '', age: '', status: '', editing: true });
  //   this.addRowActive = true;
  //   this.updatePagination();
  // }


  // 🔹 Ajoute une nouvelle ligne et met à jour la pagination
  addRow() {
    // Générer une nouvelle ligne vide avec les clés des colonnes définies dans settings
    const newRow: any = {};

    Object.keys(this.settings.columns).forEach(colKey => {
      newRow[colKey] = ''; // Initialise chaque colonne avec une valeur vide
    });

    newRow.editing = true; // Activer le mode édition
    newRow.isNew = true; // Marquer la ligne comme nouvelle

    this.originalData.unshift(newRow); // Ajouter la nouvelle ligne au début du tableau
    this.addRowActive = true;
    this.updatePagination();
  }

  // 🔹 Active/désactive le mode édition
  editRow(row: any) {
    if (!row._backup) {
      row._backup = { ...row }; // Sauvegarde de l'état initial
    }
    row.editing = !row.editing;
    this.addRowActive = false;
  }

  deleteRow(row: TableData) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) {
      this.originalData = this.originalData.filter(r => r !== row);
      this.updatePagination();
      this.addRowActive = false;
    }
  }

  confirmEdit(row: any) {
    if (row.isNew) {
      // ✅ Nouvelle ligne : on valide l'ajout
      row.isNew = false; // Elle devient une ligne normale
    }
    row.editing = false; // Désactiver le mode édition
    this.addRowActive = false;
    row._backup = { ...row };
    console.log(row._backup);
    
  }

  cancelEdit(row: any) {
    if (row.isNew) {
      // ✅ Annuler l'ajout => supprimer la ligne
      const index = this.originalData.indexOf(row);
      
      if (index !== -1) {
        this.originalData.splice(index, 1);
        this.updatePagination();
      }
    } else {
      // ✅ Annuler la modification => restaurer les anciennes valeurs
      Object.keys(row).forEach(key => {
        if (row._backup && row._backup.hasOwnProperty(key)) {
          row[key] = row._backup[key]; // Restaurer les anciennes valeurs
          console.log(row._backup);
          
          this.updatePagination();
        }
      });
    }
    row.editing = false; // Désactiver le mode édition
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.originalData.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    this.paginateData();
  }

  paginateData() {
    const itemsPerPageNum = Number(this.itemsPerPage);
    const start = (this.currentPage - 1) * itemsPerPageNum;
    const end = start + itemsPerPageNum;
    this.paginatedData = this.originalData.slice(start, end);
  }

  firstPage() {
    this.currentPage = 1; this.paginateData();
  }
  lastPage() {
    this.currentPage = this.totalPages; this.paginateData();
  }
  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.paginateData(); }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.paginateData(); }
  }

  onItemSelect(item: any) {
    console.log('Élément sélectionné', item);
  }

  onItemDeSelect(item: any) {
    console.log('Élément désélectionné', item);
  }

  onSelectAll(items: any) {
    console.log('Tous les éléments sélectionnés', items);
  }

  onDeSelectAll() {
    console.log('Tous les éléments désélectionnés');
  }

  openDialog(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      disableClose: false,
      data: { templateRef }
    });
  }

  openDialogDetails(templateRef: TemplateRef<any>, rowData: any) {
    this.eyeData = rowData;
    this.dialogRef = this.dialog.open(templateRef, {
      width: '500px',

    });
  }


  // 🔹 Met à jour l'affichage de la sélection globale
  toggleAllRows() {
    this.originalData.forEach(row => row.selected = this.selectAll);
  }

  // 🔹 Affiche la plage des éléments visibles
  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.originalData.length);
    return `${start} - ${end}`;
  }

  // 🔹 Supprime toutes les lignes sélectionnées
  deleteSelectedRows() {
    if (confirm("Êtes-vous sûr de vouloir supprimer les lignes sélectionnées ?")) {
      this.originalData = this.originalData.filter(row => !row.selected);
      this.selectAll = false; // Désélectionner tout
      this.updatePagination();
    }
  }

  // 🔹 Vérifie si au moins une ligne est sélectionnée
  isAnyRowSelected(): boolean {
    return this.originalData.some(row => row.selected);
  }
}


