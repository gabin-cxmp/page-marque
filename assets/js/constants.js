// Configurations et éléments DOM
export const CONFIG = {
  itemsPerPage: 20,
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
  microviewCategory: document.getElementById('microview-category'),
  microviewSociete: document.getElementById('microview-societe'),
  microviewTradeshow: document.getElementById('microview-tradeshow'),
  microviewDescription: document.getElementById('microview_description'),
  microviewAsk : document.getElementById('microview-aks'),
  microviewWebsite : document.getElementById('microview-website'),
  microviewInstagram : document.getElementById('microview-instagram'),
  reinitializeBtn : document.getElementById('reinitialize-button'),
  exportBtn : document.getElementById('export-button')
};


export const FILTER_CONFIG = {
  pays: {
    legend: 'Tous les pays',
    fieldName: 'Supplier Country',
    type: 'direct',
    possibleValues: []
  },
  category: {
    legend: 'Toutes les categories',
    fieldName: 'Category',
    type: 'direct',
    possibleValues: [] 
  },
  sector: {
    legend: 'Tous les secteurs',
    fieldName: 'Supplier Sector',
    type: 'direct',
    possibleValues: []
  }
};
