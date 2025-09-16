/* view.js */
import { DOM, CONFIG } from './constants.js';
import { STATE } from './state.js';
import { normalizeStr, getUrlParam, updatePagination } from './utils.js';
import { generateAllFilters } from './utils.js';
import { applyFilters } from './utils.js';

export const initializeAllFilters = () => {
  const filtersContainer = document.getElementById('dynamic-filters-container');
  if (filtersContainer) {
    generateAllFilters(filtersContainer);
  }

  // Init radio buttons "tradeshow"
  DOM.radioButtons.forEach((btn) => {
    btn.addEventListener('change', applyFilters);
  });

  // Vérifie si un query param est présent au chargement
  const paramValue = getUrlParam('tradeshow') || 'all';
  const radio = document.querySelector(`input[name="tradeshow"][value="${paramValue}"]`);
  if (radio) radio.checked = true;

  // Applique les filtres dès le départ
  applyFilters();
};

export const createExhibitorCard = (item) => {
  const container = document.createElement('div');
  container.className = 'card';
  container.href = `?supplier-name=${encodeURIComponent(item['Supplier Name'])}`;

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('card_content-container');

  const title = document.createElement('p');
  title.className = 'card-title';
  title.textContent = item['Supplier Name'].toUpperCase();

  const country = document.createElement('p');
  country.classList.add('card-country');
  country.textContent = item['Supplier Country'];

  const focusAndCategory = document.createElement('div');
  focusAndCategory.classList.add('focus-and-category');

  const focus = document.createElement('p');
  focus.textContent = item['Focus'];

  const category = document.createElement('p');
  category.textContent = item['Main Product Category'];

  const span = document.createElement('span');
  span.textContent = focus.textContent != '' && category.textContent != '' ? '>' : '';

  focusAndCategory.append(focus, span, category)

  const seeMore = document.createElement('a');
  seeMore.classList.add('card-see-more');

  const plusIcon = document.createElement('img');
  plusIcon.setAttribute("src", "assets/img/chevron-right.svg");

  seeMore.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState({}, '', container.href);
    renderMicroView();
  });

  contentContainer.append(title, country, focusAndCategory);
  seeMore.append(plusIcon);

  container.append(contentContainer, seeMore);
  return container;
};

export const renderExhibitorsList = (data) => {
  const container = DOM.exhibitorsList;

  const oldCards = Array.from(container.children);
  oldCards.forEach(card => {
    card.classList.add('hidden-out');
  });

  setTimeout(() => {
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    data.forEach(item => {
      const card = createExhibitorCard(item);
      card.classList.add('hidden-initial');
      fragment.appendChild(card);
    });

    container.appendChild(fragment);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const newCards = Array.from(container.children);
        newCards.forEach(card => card.classList.remove('hidden-initial'));
      });
    });

  }, 300);
};

export const renderPagination = (totalItems, currentPage) => {
  DOM.paginationButtonsWrapper.innerHTML = '';
  const totalPages = Math.ceil(totalItems / CONFIG.itemsPerPage);

  if (totalPages <= 1) return;

  const createButton = (text, disabled, onClick, active = false, className = 'secondary-button') => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (disabled) btn.disabled = true;
    if (active) btn.classList.add('active');
    if (className) btn.classList.add(className);
    btn.addEventListener('click', onClick);
    return btn;
  };

  DOM.paginationButtonsWrapper.appendChild(
    createButton('Back', currentPage === 1, () => {
      if (currentPage > 1) {
        STATE.currentPage--;
        updatePagination();
      }
    })
  );

  const numberButtonsContainer = document.createElement('div');
  numberButtonsContainer.className = 'number-buttons';

  const maxVisiblePages = window.matchMedia("(width <= 500px)").matches === false ? 5 : 3;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    numberButtonsContainer.appendChild(createButton('1', false, () => {
      STATE.currentPage = 1;
      updatePagination();
    }));
    if (startPage > 2) {
      numberButtonsContainer.appendChild(createButton('...', true, () => {}));
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    numberButtonsContainer.appendChild(
      createButton(i, false, () => {
        STATE.currentPage = i;
        updatePagination();
      }, i === currentPage)
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      numberButtonsContainer.appendChild(createButton('...', true, () => {}));
    }
    numberButtonsContainer.appendChild(createButton(totalPages, false, () => {
      STATE.currentPage = totalPages;
      updatePagination();
    }));
  }

  DOM.paginationButtonsWrapper.appendChild(numberButtonsContainer);

  DOM.paginationButtonsWrapper.appendChild(
    createButton('Next', currentPage === totalPages, () => {
      if (currentPage < totalPages) {
        STATE.currentPage++;
        updatePagination();
      }
    })
  );
};

export const renderMicroView = () => {

  window.scrollTo({ top: 0});

  const supplierParam = getUrlParam('supplier-name');
  if (!supplierParam) {
    hideMicroView();
    return;
  }

  const supplierNameDecoded = decodeURIComponent(supplierParam);
  const supplierNorm = normalizeStr(supplierNameDecoded);

  const supplierData = STATE.exhibitorsOnly.find(
    ex => normalizeStr(ex['Supplier Name']) === supplierNorm
  );
  if (!supplierData) {
    hideMicroView();
    return;
  }

  STATE.currentSupplier = supplierData;

  console.log(STATE.currentSupplier);

  DOM.listContainer.classList.add('hidden');

  const microview = DOM.microviewContainer;

  microview.classList.remove('hidden');

  DOM.microviewContactButton.classList.add('hidden');
  DOM.microviewTitle.textContent = supplierData['Supplier Name'];
  DOM.microviewStand.textContent = supplierData['Stand Number'];
  if(DOM.microviewStand.textContent == ''){
    DOM.microviewStand.parentElement.style.display = "none";
  }
  DOM.microviewCountry.textContent = supplierData['Supplier Country'];
  DOM.microviewFocus.textContent = supplierData['Focus'];
  DOM.microviewCategory.textContent = supplierData['Main Product Category'];
  DOM.microviewSpan.textContent = DOM.microviewFocus.textContent != '' && DOM.microviewCategory.textContent != '' ?  '>' : '';

  const products = getProductsForSupplier(supplierData['Supplier Name'], STATE.allData);

  renderCertifications(supplierData, products);

  renderMicroviewProductDetails(products);

  if (supplierData['Email']) {
   // DOM.microviewContactButton.classList.remove('hidden');
  }

  DOM.microviewContactButton.onclick = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${supplierData['Email']}`;
  };

  DOM.goBackButton.onclick = () => {
    const cameFromInternalNav = document.referrer && document.referrer.includes(window.location.hostname);

    if (cameFromInternalNav) {
      DOM.listContainer.classList.remove('hidden');
      DOM.microviewContainer.classList.add('hidden');
      window.history.pushState({}, '', window.location.pathname);
    } else {
      window.location.href = window.location.origin + window.location.pathname;
    }
  };
};

export const hideMicroView = () => {
  DOM.listContainer.classList.remove('hidden');
  DOM.microviewContainer.classList.add('hidden');
  STATE.currentSupplier = null;
};
