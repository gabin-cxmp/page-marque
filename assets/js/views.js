/* view.js */
import { DOM, CONFIG } from './constants.js';
import { STATE } from './state.js';
import { normalizeStr, getUrlParam, updatePagination } from './utils.js';
import { generateAllFilters } from './utils.js';
import { applyFilters } from './utils.js';


const tradeshowList = document.getElementById('tradeshow-buttons_wrapper');

function checkSticky() {
  const stickyTop = tradeshowList.getBoundingClientRect().top + window.scrollY; 
  if (window.scrollY + 32 >= stickyTop) {
    tradeshowList.classList.add('active');
  } else {
    tradeshowList.classList.remove('active');
  }
}

window.addEventListener('scroll', checkSticky);
window.addEventListener('resize', checkSticky); 


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
  const container = document.createElement('a');
  container.className = 'card';
  container.href = `?supplier-name=${encodeURIComponent(item['Supplier Name'])}`;

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('card_content-container');

  const title = document.createElement('p');
  title.className = 'card-title';
  title.textContent = item['Supplier Name'].toUpperCase();

  const countryAndCategory = document.createElement('div');
  countryAndCategory.classList.add('country-and-category');

  const country = document.createElement('p');
  country.textContent = item['Supplier Country'];

  const horizontalSeparator = document.createElement('div');
  horizontalSeparator.classList.add('horizontal-separator');

  const category = document.createElement('p');
  category.textContent = item['Category'];

  countryAndCategory.append(country, horizontalSeparator, category)

  const tradeshowAndBooth = document.createElement('div');
  tradeshowAndBooth.classList.add('tradeshow-booth_wrapper');

  const tradeshow = document.createElement('p');
  tradeshow.textContent = item['Tradeshow'];

  const booth = document.createElement('span');
  booth.classList.add('booth-number');
  booth.textContent = item['Booth'];

  tradeshowAndBooth.append(tradeshow, !booth.textContent ? '' : booth);

  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('card-buttons_wrapper');

  const seeMore = document.createElement('a');
  seeMore.classList.add('card-buttons');

  const plusIcon = document.createElement('p');
  plusIcon.textContent = '+';
  

  seeMore.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState({}, '', container.href);
    renderMicroView();
  });

  seeMore.append(plusIcon);

   container.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState({}, '', container.href);
    renderMicroView();
  });

  const goToAks = document.createElement('a');
  goToAks.classList.add('card-buttons', 'black');
  goToAks.target = "_blank"
  goToAks.href = item['AKS Link'];

  const cartIcon = document.createElement('img');
  cartIcon.src = "../assets/img/shopping-cart.svg";

  goToAks.append(cartIcon);

  contentContainer.append(title, countryAndCategory, tradeshowAndBooth);

  buttonsWrapper.append(seeMore, goToAks.href.includes('ankorstore') ? goToAks : '');

  container.append(contentContainer, buttonsWrapper);
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

  const backSVG = `<svg width="16" height="16" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8786 18.961L9.8786 12.961L15.8786 6.96102" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  const nextSVG = `<svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.11835 17.9971L15.1183 11.9971L9.11835 5.99707" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const createNavButton = (text, svgContent, imgFirst = false, disabled, onClick) => {
    const btn = document.createElement('button');
    btn.classList.add('secondary-button');
    if (disabled) btn.disabled = true;

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.justifyContent = 'center';

    const createSVGElement = (svgString) => {
      const template = document.createElement('template');
      template.innerHTML = svgString.trim();
      const svgNode = template.content.firstChild;
      svgNode.style.flexShrink = '0';
      return svgNode;
    };

    if (svgContent && imgFirst) wrapper.appendChild(createSVGElement(svgContent));

    const span = document.createElement('span');
    span.textContent = text;
    wrapper.appendChild(span);

    if (svgContent && !imgFirst) wrapper.appendChild(createSVGElement(svgContent));

    btn.appendChild(wrapper);
    btn.addEventListener('click', onClick);
    return btn;
  };

  DOM.paginationButtonsWrapper.appendChild(
    createNavButton(
      'Back',
      backSVG,
      true,
      currentPage === 1,
      () => {
        if (currentPage > 1) {
          STATE.currentPage--;
          updatePagination();
        }
      }
    )
  );

  const numberButtonsContainer = document.createElement('div');
  numberButtonsContainer.className = 'number-buttons';

  const maxVisiblePages = window.matchMedia("(width <= 500px)").matches === false ? 5 : 3;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const createNumberButton = (text, disabled, onClick, active = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add('secondary-button');
    if (disabled) btn.disabled = true;
    if (active) btn.classList.add('active');
    btn.addEventListener('click', onClick);
    return btn;
  };

  if (startPage > 1) {
    numberButtonsContainer.appendChild(createNumberButton('1', false, () => { STATE.currentPage = 1; updatePagination(); }));
    if (startPage > 2) {
      numberButtonsContainer.appendChild(createNumberButton('...', true, () => {}));
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    numberButtonsContainer.appendChild(createNumberButton(i, false, () => {
      STATE.currentPage = i;
      updatePagination();
    }, i === currentPage));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      numberButtonsContainer.appendChild(createNumberButton('...', true, () => {}));
    }
    numberButtonsContainer.appendChild(createNumberButton(totalPages, false, () => {
      STATE.currentPage = totalPages;
      updatePagination();
    }));
  }

  DOM.paginationButtonsWrapper.appendChild(numberButtonsContainer);

  DOM.paginationButtonsWrapper.appendChild(
    createNavButton(
      'Next',
      nextSVG,
      false, 
      currentPage === totalPages,
      () => {
        if (currentPage < totalPages) {
          STATE.currentPage++;
          updatePagination();
        }
      }
    )
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

  DOM.microviewTitle.textContent = supplierData['Supplier Name'];
  supplierData['Booth'] ? DOM.microviewStand.textContent = supplierData['Booth'] : DOM.microviewStand.style.display = "none";
  DOM.microviewCountry.textContent = supplierData['Supplier Country'];
  DOM.microviewCategory.textContent = supplierData['Category'];
  DOM.microviewSociete.textContent = supplierData['Corporate Name'];
  DOM.microviewTradeshow.textContent = supplierData['Tradeshow'];
  DOM.microviewDescription.textContent = supplierData['Description'];
  supplierData['AKS Link'] ? DOM.microviewAsk.href = supplierData['AKS Link'] : DOM.microviewAsk.style.display = "none";
  supplierData['Website'] ? DOM.microviewWebsite.href = supplierData['Website'] : DOM.microviewWebsite.style.display = "none";
  supplierData['Instagram'] ? DOM.microviewInstagram.href = supplierData['Instagram'] : DOM.microviewInstagram.style.display = "none";

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
