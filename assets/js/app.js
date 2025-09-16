import { CONFIG, DOM } from './constants.js';
import { STATE } from './state.js';
import { loadData } from './services.js';
import { debounce, applyFilters, getUrlParam, updatePagination } from './utils.js';
import { initializeAllFilters, renderMicroView, hideMicroView } from './views.js';

// Initialisation
(async () => {
  const { allData, exhibitorsOnly } = await loadData(CONFIG.csvUrl);
  STATE.allData = allData;
  STATE.exhibitorsOnly = exhibitorsOnly;
  STATE.filteredData = [...exhibitorsOnly];
  console.log(STATE.allData);
  initializeAllFilters();

  const supplierParam = getUrlParam('supplier-name');
  
  if (supplierParam) {
    renderMicroView();
  } else {
    updatePagination();
  }
})();

// Gestion des événements
DOM.searchInput.addEventListener('input', debounce(applyFilters, 300));
DOM.checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
window.addEventListener('popstate', renderMicroView);

// Expose les fonctions nécessaires globalement si besoin
window.hideMicroView = hideMicroView;