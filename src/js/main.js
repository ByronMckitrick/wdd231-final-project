import { getTrails } from './data.js';
import { renderTrailCards } from './render.js';

const trailGrid = document.getElementById('trail-grid');
const favoritesButton = document.getElementById('favorites-button');
const favoritesModal = document.getElementById('favorites-modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');

function closeFavoritesModal() {
  if (!favoritesModal || !favoritesButton) {
    return;
  }

  favoritesModal.setAttribute('aria-hidden', 'true');
  favoritesButton.classList.remove('is-active');
  favoritesButton.setAttribute('aria-expanded', 'false');
}

function initializeModal() {
  if (!favoritesButton || !favoritesModal || !modalClose || !modalBackdrop) {
    return;
  }

  favoritesButton.addEventListener('click', () => {
    const isOpen = favoritesModal.getAttribute('aria-hidden') === 'false';

    if (isOpen) {
      closeFavoritesModal();
    } else {
      favoritesModal.setAttribute('aria-hidden', 'false');
      favoritesButton.classList.add('is-active');
      favoritesButton.setAttribute('aria-expanded', 'true');
    }
  });

  modalClose.addEventListener('click', closeFavoritesModal);
  modalBackdrop.addEventListener('click', closeFavoritesModal);
}

async function init() {
  initializeModal();

  if (!trailGrid) {
    return;
  }

  try {
    const trails = await getTrails();
    renderTrailCards(trails, trailGrid);
  } catch (error) {
    console.error(error);
    trailGrid.innerHTML = '<p class="trail-empty">Unable to load trail data right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
