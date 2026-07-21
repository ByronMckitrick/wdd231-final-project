import { getPlannedHikes, addPlannedHike, removePlannedHike, getStoredFavorites, saveFavorites } from './storage.js';

function qs(selector) {
  return document.querySelector(selector);
}

function renderPlannedList() {
  const list = qs('.planned-list');
  if (!list) return;

  const plans = getPlannedHikes();
  if (!plans.length) {
    list.innerHTML = '<li class="favorites-empty">No planned hikes yet.</li>';
    return;
  }

  list.innerHTML = plans
    .map((p) => `
      <li class="planned-list-item" data-id="${p.id}">
        <span class="planned-name">${p.name}</span>
        ${p.notes ? `<div class="planned-notes">${p.notes}</div>` : ''}
        <button class="button button--secondary planned-remove" type="button" data-id="${p.id}">Remove</button>
      </li>
    `)
    .join('');
}

function handleRemove(event) {
  const btn = event.target.closest('.planned-remove');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (!id) return;
  removePlannedHike(id);
  renderPlannedList();
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function init() {
  let favorites = getStoredFavorites();

  function closeFavoritesModal() {
    const favoritesModal = qs('#favorites-modal');
    const favoritesButton = qs('#favorites-button');
    if (!favoritesModal || !favoritesButton) return;
    favoritesModal.setAttribute('aria-hidden', 'true');
    favoritesButton.classList.remove('is-active');
    favoritesButton.setAttribute('aria-expanded', 'false');
  }

  function renderFavoritesModal() {
    const favoritesList = qs('.favorites-list');
    if (!favoritesList) return;
    if (!favorites.length) {
      favoritesList.innerHTML = '<li class="favorites-empty">No favorite trails saved yet.</li>';
      return;
    }

    favoritesList.innerHTML = favorites
      .map((favoriteTrail) => `<li>${favoriteTrail}</li>`)
      .join('');
  }

  function initializeModal() {
    const favoritesButton = qs('#favorites-button');
    const favoritesModal = qs('#favorites-modal');
    const modalClose = qs('#modal-close');
    const modalBackdrop = qs('#modal-backdrop');

    if (!favoritesButton || !favoritesModal || !modalClose || !modalBackdrop) return;

    favoritesButton.addEventListener('click', () => {
      const isOpen = favoritesModal.getAttribute('aria-hidden') === 'false';

      if (isOpen) {
        closeFavoritesModal();
      } else {
        favoritesModal.setAttribute('aria-hidden', 'false');
        favoritesButton.classList.add('is-active');
        favoritesButton.setAttribute('aria-expanded', 'true');
        renderFavoritesModal();
      }
    });

    modalClose.addEventListener('click', closeFavoritesModal);
    modalBackdrop.addEventListener('click', closeFavoritesModal);
  }

  initializeModal();

  const form = qs('.planned-form');
  const selectedInput = qs('#selected-hike');
  const notesInput = qs('#plan-notes');
  const nameError = qs('#hike-name-error');
  const list = qs('.planned-list');

  if (list) {
    renderPlannedList();
    list.addEventListener('click', handleRemove);
  }

  const prefill = getQueryParam('trail');
  if (prefill && selectedInput) {
    selectedInput.value = decodeURIComponent(prefill);
  }

  if (form) {
    function clearNameError() {
      if (nameError) {
        nameError.textContent = '';
      }
    };

    function showFormError(message, input) {
      if (nameError) {
        nameError.textContent = message;
      }
    };

    form.addEventListener('input', (e) => {
      e.preventDefault();

      const name = (selectedInput?.value || '').trim();
      const notes = (notesInput?.value || '').trim();

      const hasBadCharacters = /[<>]/.test(name) || /[<>]/.test(notes);

      if (hasBadCharacters) {
        showFormError('Please do not use < or >.', selectedInput || notesInput);
        return;
      }

      if (name.length > 35) {
        const message = 'Please use 35 characters or less.';
        showFormError(message, selectedInput);
        return;
      }

      clearNameError();
    })

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (selectedInput?.value || '').trim();
      const notes = (notesInput?.value || '').trim();

      const hasBadCharacters = /[<>]/.test(name) || /[<>]/.test(notes);

      if (hasBadCharacters) {
        showFormError('Please do not use < or >.', selectedInput || notesInput);
        return;
      }

      if (name.length > 35) {
        const message = 'Please use 35 characters or less.';
        showFormError(message, selectedInput);
        return;
      }

      clearNameError();
      addPlannedHike({ name, notes });
      if (notesInput) notesInput.value = '';
      if (selectedInput) selectedInput.value = '';
      renderPlannedList();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
