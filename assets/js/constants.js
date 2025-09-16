// Configurations et éléments DOM
export const CONFIG = {
  itemsPerPage: 12,
  csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlbeaP2ujP_rZSxXWc0fyg2bvpten6bIq-5ZyGh7kjkdl52aN3vldcSQG482a2fToH4a0Qg7nN0-gL/pub?output=csv"
};

export const DOM = {
  exhibitorsList: document.getElementById('exhibitors-list'),
  searchInput: document.getElementById('searchInput'),
  noResults: document.getElementById('noResults'),
  checkboxes: document.querySelectorAll('.checkbox-container input[type="checkbox"]'),
  checkboxesContainers: document.querySelectorAll('.checkboxes-container'),
  filterDropdownActivator: document.querySelectorAll('.filter-dropdown_activator'),
  paginationButtonsWrapper: document.querySelector('.pagination-buttons_wrapper'),
  exportPDFButton: document.getElementById('export-pdf_button'),
  listContainer: document.getElementById('list-container'),
  microviewContainer: document.getElementById('microview-container'),
  loaders: document.querySelectorAll('.loader'),
  radioButtons : document.querySelectorAll('input[name="tradeshow"]'),
  goBackButton: document.getElementById('back-button_micro'),
  microviewContentWrapper: document.getElementById('microview-main-content_wrapper'),
  microviewTitle: document.getElementById('microview-title'),
  microviewStand: document.getElementById('microview-stand'),
  microviewCountry: document.getElementById('microview-country'),
  microviewFocus: document.getElementById('microview-focus'),
  microviewCategory: document.getElementById('microview-category'),
  microviewSpan: document.getElementById('microview-span'),
  microviewContactButton: document.getElementById('microview-contact_button'),
  certificationsList: document.getElementById('certifications-list'),
  madeInContainer : document.querySelector('#made-in-fieldset'),
};


export const FILTER_CONFIG = {
  pays: {
    legend: 'Pays',
    fieldName: 'Supplier Country',
    type: 'direct',
    possibleValues: []
  },
  category: {
    legend: 'Categories',
    fieldName: 'Category',
    type: 'direct',
    possibleValues: [] // Sera rempli dynamiquement
  },
  sector: {
    legend: 'Secteurs',
    fieldName: 'Supplier Sector',
    type: 'direct',
    possibleValues: [] // Sera rempli dynamiquement
  }
};
