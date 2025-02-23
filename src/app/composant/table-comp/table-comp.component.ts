import { Component, OnInit, AfterViewInit } from '@angular/core';
import Iconify from '@iconify/iconify';

interface TableData {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
  editing?: boolean;
}

interface DropdownItem {
  id: number;
 text: string;
}

@Component({
  selector: 'app-table-comp',
  templateUrl: './table-comp.component.html',
  styleUrls: ['./table-comp.component.scss'],
})
export class TableCompComponent implements OnInit {
  data: TableData[] = [
  ];

  selectedOptions: any[] = []; // Stocke les valeurs sélectionnées

  options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];

  isDropdownOpen = false;

  dropdownList: any[] = [
    { id: 4, text: 'Option 4' },
    { id: 4, text: 'Option 4' },
    { id: 4, text: 'Option 4' },
    { id: 4, text: 'Option 4' },
  ];

  selectedItems: DropdownItem[] = [];

  dropdownSettings = {
    singleSelection: false,
    noDataAvailablePlaceholderText: 'La liste est vide',
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1, maxHeight: 100,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  }

  keepOrder = (a: any, b: any): number => 0;

  settings = {
    actions: {
      active: true,
      title: 'Actions',
      add: true,
      edit: true,
      delete: true,
    },

    columns: {
      colOne: {
        title: 'Nom',
        type: 'string',
      },

      colTwo: {
        title: 'Prénom',
        type: 'string',
      },

      colThree: {
        title: 'Date d\'anniversaire',
        type: 'date',
      },

      colFour: {
        title: 'Âge',
        type: 'number',
      },

      colFive: {
        title: 'Statut',
        type: 'badge',
        badge: {
          célibataire: 'green',
          marié: 'red',
        },
      },
    },
  };

  paginatedData: TableData[] = [];
  searchText: string = '';
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  selectedRow: TableData | null = null;

  constructor() {
    this.updatePagination();
  }

  ngOnInit() {
    Iconify.scan(); // Scanner les icônes dans le DOM

    // Sélectionner tous les éléments par défaut
    this.selectedItems = [...this.dropdownList];

    // Configuration du dropdown
    console.log('Dropdown List:', this.dropdownList);
  }

  applyFilter() {
    const filtered = this.data.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
    this.paginatedData = filtered.slice(0, this.itemsPerPage);
  }

  addRow() {
    this.data.unshift({ col1: '', col2: '', col3: '', col4: '', col5: '', editing: true });
    this.updatePagination();
  }

  editRow(row: TableData) {
    row.editing = !row.editing;
  }

  deleteRow(row: TableData) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) {
      this.data = this.data.filter(r => r !== row);
      this.updatePagination();
    }
  }

  openDetails(row: TableData) {
    this.selectedRow = row;
  }

  closeDetails() {
    this.selectedRow = null;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginatedData = this.data.slice(0, this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
    this.paginatedData = this.data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
    this.paginatedData = this.data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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
}
