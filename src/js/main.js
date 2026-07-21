import { getTrails } from './data.js';
import { escapeHtml, renderTrailCards } from './render.js';
import { getStoredFavorites, saveFavorites } from './storage.js';

const trailGrid = document.getElementById('trail-grid');
const favoritesButton = document.getElementById('favorites-button');
const favoritesModal = document.getElementById('favorites-modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
let trails = [];
let favorites = [];

function closeFavoritesModal() {
  if (!favoritesModal || !favoritesButton) {
    return;
  }

  favoritesModal.setAttribute('aria-hidden', 'true');
  favoritesButton.classList.remove('is-active');
  favoritesButton.setAttribute('aria-expanded', 'false');
}

function renderFavoritesModal() {
  const favoritesList = document.querySelector('.favorites-list');

  if (!favoritesList) {
    return;
  }

  if (!favorites.length) {
    favoritesList.innerHTML = '<li class="favorites-empty">No favorite trails saved yet.</li>';
    return;
  }

  favoritesList.innerHTML = favorites
    .map((favoriteTrail) => `<li>${escapeHtml(favoriteTrail)}</li>`)
    .join('');
}

function toggleFavorite(trailName) {
  const normalizedName = String(trailName || '').trim();

  if (!normalizedName) {
    return;
  }

  favorites = favorites.includes(normalizedName)
    ? favorites.filter((favoriteTrail) => favoriteTrail !== normalizedName)
    : favorites.concat(normalizedName)

  saveFavorites(favorites);
  renderFavoritesModal();

  if (trailGrid) {
    renderTrailCards(trails, trailGrid, favorites);
  }
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

function initializeFavoriteInteractions() {
  if (!trailGrid) {
    return;
  }

  trailGrid.addEventListener('click', (event) => {
    // const favoriteButton = event.target.closest('.favorite-button');
    const favoriteButton = document.getElementById('favorite-button')
    if (!favoriteButton) {
      return;
    }

    toggleFavorite(favoriteButton.dataset.trailName);
  });
}

function initializePlanInteractions() {
  if (!trailGrid) return;

  trailGrid.addEventListener('click', (event) => {
    const planButton = event.target.closest('.trail-link');
    if (!planButton) return;

    const trailName = planButton.dataset.trailName || '';
    const encoded = encodeURIComponent(trailName);
    window.location.href = `./plannedHikes.html?trail=${encoded}`;
  });
}

async function init() {
  initializeModal();
  initializeFavoriteInteractions();
  initializePlanInteractions();
  favorites = getStoredFavorites();
  renderFavoritesModal();

  if (!trailGrid) {
    return;
  }

  try {
    trails = await getTrails();
    renderTrailCards(trails, trailGrid, favorites);
  } catch (error) {
    console.error(error);
    trailGrid.innerHTML = '<p class="trail-empty">Unable to load trail data right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
