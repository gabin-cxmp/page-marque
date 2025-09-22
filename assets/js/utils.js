/* utils.js - Version Dropdown */
import { CONFIG, DOM, FILTER_CONFIG } from './constants.js';
import { STATE } from './state.js';
import { renderExhibitorsList, renderPagination } from './views.js';

export const normalizeStr = (str) =>
  str ? str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

export const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const getUrlParam = (param) =>
  new URLSearchParams(window.location.search).get(param);

// ----------------- FILTRES -----------------
export const generateAllFilters = (filtersContainer) => {
  Object.entries(FILTER_CONFIG).forEach(([filterKey, config]) => {
    const opts = getAvailableOptionsForFilter(config.fieldName);
    if (opts.length) filtersContainer.appendChild(createDropdownFilter(filterKey, config, opts));
  });

  filtersContainer.appendChild(createNouveautesCheckbox());
};

export const getAvailableOptionsForFilter = (fieldName) => {
  const opts = new Set();
  STATE.exhibitorsOnly.forEach((ex) => {
    const val = ex[fieldName]?.trim();
    if (val) opts.add(val);
  });
  return [...opts].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
};

// ----------------- DROPDOWN -----------------
export const createDropdownFilter = (filterKey, config, options) => {
  const container = el('div', { class: 'custom-dropdown_container', 'data-filter': filterKey }, [
    el('div', { class: 'custom-dropdown' }, [
      el('div', {
        class: 'dropdown-button',
        tabindex: 0,
        role: 'button',
        'aria-haspopup': 'listbox',
        'aria-expanded': 'false'
      }, [
        el('span', { class: 'selected-text' }, `${config.legend}`),
        el('img', { class: 'dropdown-arrow', src: 'assets/img/chevron-down.svg' })
      ]),
      el('ul', { class: 'dropdown-options', role: 'listbox', style: 'display:none' }, [
        el('li', {
          class: 'dropdown-option selected',
          role: 'option',
          'data-value': ''
        }, config.legend),
        ...options.map((o) =>
          el('li', { class: 'dropdown-option', role: 'option', 'data-value': o }, o)
        )
      ])
    ]),
    el('input', { type: 'hidden', id: `${filterKey}-select`, name: filterKey, value: '' })
  ]);

  setupDropdownEvents(container);
  return container;
};

const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  [].concat(children).forEach((c) =>
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
  );
  return node;
};

export const setupDropdownEvents = (container) => {
  const btn = container.querySelector('.dropdown-button');
  const list = container.querySelector('.dropdown-options');
  const text = container.querySelector('.selected-text');
  const arrow = container.querySelector('.dropdown-arrow');
  const hidden = container.querySelector('input[type=hidden]');
  const dropdown = container.querySelector('.custom-dropdown');

  const open = () => {
  document.querySelectorAll('.custom-dropdown.open').forEach((d) => {
    if (!container.contains(d)) {
      d.classList.remove('open');
      d.querySelector('.dropdown-options').style.display = 'none';
      d.querySelector('.dropdown-button').setAttribute('aria-expanded', 'false');
      d.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
    }
  });

  const hiddenValue = hidden.value;

  list.querySelectorAll('.dropdown-option').forEach((opt) => {
    if (opt.dataset.value === "") {
      opt.style.display = hiddenValue ? "block" : "none";
    } else if (opt.dataset.value === hiddenValue) {
      opt.style.display = "none";
    } else {
      opt.style.display = "block";
    }
  });

  dropdown.classList.add('open');
  list.style.display = 'block';
  btn.setAttribute('aria-expanded', 'true');
  arrow.style.transform = 'rotate(180deg)';
};

  const close = () => {
    dropdown.classList.remove('open');
    list.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    arrow.style.transform = 'rotate(0deg)';
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.contains('open') ? close() : open();
  });

  btn.addEventListener('keydown', (e) => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      dropdown.classList.contains('open') ? close() : open();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      list.querySelector('.dropdown-option')?.focus();
    }
  });

  list.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (e.target.classList.contains('dropdown-option')) {
      text.textContent = e.target.textContent;
      hidden.value = e.target.dataset.value;

      if (hidden.value) text.classList.add('has-value');
      else text.classList.remove('has-value');

      list.querySelectorAll('.dropdown-option').forEach((o) => o.classList.remove('selected'));
      e.target.classList.add('selected');
      close();
      applyFilters();
    }
  });

  list.addEventListener('keydown', (e) => {
    const opts = [...list.querySelectorAll('.dropdown-option')];
    let idx = opts.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      opts[(idx + 1) % opts.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      opts[idx <= 0 ? opts.length - 1 : idx - 1].focus();
    } else if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      e.target.click();
    } else if (e.key === 'Escape') {
      close();
      btn.focus();
    }
  });

  document.addEventListener('click', () => {
    close();
  });
};

// ----------------- CHECKBOX -----------------
export const createNouveautesCheckbox = () => {
  const container = document.createElement('div');
  container.className = 'checkbox-container nouveautes-container';

  const checkbox = Object.assign(document.createElement('input'), {
    type: 'checkbox',
    id: 'nouveautes',
    name: 'nouveautes',
    value: 'true'
  });

  const label = document.createElement('label');
  label.setAttribute('for', 'nouveautes');
  label.textContent = 'Nouveautés';

  checkbox.addEventListener('change', applyFilters);

  container.append(checkbox, label);

  return container;
};

// ----------------- FILTRAGE -----------------
export const applyFilters = () => {
  DOM.noResults.classList.add('hidden');
  STATE.currentPage = 1;

  const filters = {
    pays: document.getElementById('pays-select')?.value || '',
    category: document.getElementById('category-select')?.value || '',
    sector: document.getElementById('sector-select')?.value || '',
    nouveautes: document.getElementById('nouveautes')?.checked || false,
    search: normalizeStr(DOM.searchInput.value.trim()),
    tradeshow: document.querySelector('input[name="tradeshow"]:checked')?.value || 'all'
  };

  STATE.filteredData = STATE.exhibitorsOnly.filter((ex) => {
    const nameNorm = normalizeStr(ex['Supplier Name'] || '');
    const matchesSearch = !filters.search || nameNorm.includes(filters.search);
    const matchesPays = !filters.pays || ex['Supplier Country']?.trim() === filters.pays;
    const matchesCategory = !filters.category || ex['Category']?.trim() === filters.category;
    const matchesSector = !filters.sector || ex['Supplier Sector']?.trim() === filters.sector;
    const matchesNew = !filters.nouveautes || (ex['Is New'] || '').toString().toLowerCase() === 'true';
    const matchesTradeshow = filters.tradeshow === 'all' || ex['Tradeshow']?.trim() === filters.tradeshow;
    return matchesSearch && matchesPays && matchesCategory && matchesSector && matchesNew && matchesTradeshow;
  });

  const url = new URL(window.location);
  url.searchParams.set('tradeshow', filters.tradeshow);
  window.history.replaceState({}, '', url);

  if (!STATE.filteredData.length) DOM.noResults.classList.remove('hidden');
  updatePagination();
};

// ----------------- PAGINATION -----------------
export const updatePagination = () => {
  const start = (STATE.currentPage - 1) * CONFIG.itemsPerPage;
  const end = start + CONFIG.itemsPerPage;
  renderExhibitorsList(STATE.filteredData.slice(start, end));
  renderPagination(STATE.filteredData.length, STATE.currentPage);
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 30);
};
