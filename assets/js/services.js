import { DOM } from './constants.js';
import { STATE } from './state.js';

export const fetchAndCleanData = async (url) => {
  const response = await fetch(url);
  const rawText = await response.text();
  const csvBody = rawText.split(/\r?\n/).join('\n').trim();
  const parsed = Papa.parse(csvBody, { header: true, skipEmptyLines: true });
  return parsed.data.map(({ "": _, ...rest }) => rest);
};

export const loadData = async (url) => {
  DOM.loaders.forEach(loader => loader.classList.remove('hidden'));
  DOM.searchInput.disabled = true; 
  DOM.checkboxes.forEach(checkbox => checkbox.disabled = true);

  const allData = await fetchAndCleanData(url);

  DOM.loaders.forEach(loader => loader.classList.add('hidden'));
  DOM.microviewContentWrapper.classList.remove('hidden');
  DOM.searchInput.disabled = false; 
  DOM.checkboxes.forEach(checkbox => checkbox.disabled = false);

  const uniqueSuppliersMap = new Map();

  allData.forEach(item => {
    if (item['Supplier Name'] && !uniqueSuppliersMap.has(item['Supplier Name'])) {
      uniqueSuppliersMap.set(item['Supplier Name'], item);
    }
  });

  const exhibitorsOnly = Array.from(uniqueSuppliersMap.values())
    .sort((a, b) => a['Supplier Name'].localeCompare(b['Supplier Name']));

  return { allData, exhibitorsOnly };
};


