function getDifficultyClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'badge--easy';
    case 'hard':
      return 'badge--hard';
    case 'moderate':
    default:
      return 'badge--moderate';
  }
}

function formatLocation(address) {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return parts[0] || 'Idaho';
  }

  const city = parts[parts.length - 2] || parts[0];
  const stateMatch = parts[parts.length - 1].match(/([A-Z]{2})/);
  const state = stateMatch ? stateMatch[1] : '';

  return state ? `${city}, ${state}` : city;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeImagePath(image) {
  if (!image) {
    return '';
  }

  const trimmedImage = String(image).trim();

  if (!trimmedImage) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(trimmedImage) || trimmedImage.startsWith('data:') || trimmedImage.startsWith('blob:')) {
    return trimmedImage;
  }

  if (trimmedImage.startsWith('/')) {
    return trimmedImage;
  }

  if (trimmedImage.startsWith('images/')) {
    return `/${trimmedImage}`;
  }

  return `/images/${trimmedImage}`;
}

export function renderTrailCards(trails, container, favorites = []) {
  if (!container) {
    return;
  }

  if (!trails.length) {
    container.innerHTML = '<p class="trail-empty">No trails available right now.</p>';
    return;
  }

  const cardsMarkup = trails
    .map((trail) => {
      const badgeClass = getDifficultyClass(trail.difficulty);
      const location = formatLocation(trail.address);
      const distanceMiles = trail.distance_miles?.toFixed(1) ?? '0.0';
      const elevationFeet = trail.distance_feet?.toLocaleString() ?? '0';
      const trailName = escapeHtml(trail.name || 'Idaho Trail');
      const description = escapeHtml(trail.description || '');
      const imageSrc = normalizeImagePath(trail.image);
      const imageMarkup = imageSrc
        ? `<img src="${escapeHtml(imageSrc)}" alt="${trailName} trail view" loading="lazy">`
        : '<div class="trail-image__fallback">⛰️</div>';
      const normalizedFavorites = favorites
        .map((favorite) => String(favorite || '').trim())
        .filter(Boolean);
      const isFavorite = normalizedFavorites.includes(String(trail.name || '').trim());
      const favoriteButtonClass = isFavorite
        ? 'button button--secondary favorite-button is-active'
        : 'button button--secondary favorite-button';
      const favoriteButtonLabel = '★'// isFavorite ? '★' : '☆';
      const favoriteAriaLabel = isFavorite ? `Remove ${trailName} from favorites` : `Save ${trailName} to favorites`;

      return `
        <article class="trail-card">
          <div class="trail-image">${imageMarkup}</div>
          <div class="trail-content">
            <div class="trail-top">
              <h3>${trailName}</h3>
              <span class="badge ${badgeClass}">${trail.difficulty}</span>
            </div>
            <p>${description}</p>
            <ul class="trail-meta">
              <li>${distanceMiles} mi</li>
              <li>${elevationFeet} ft</li>
              <li>${location}</li>
            </ul>
            <div class="trail-actions">
              <div class="trail-actions__buttons">
                <button class="${favoriteButtonClass}" type="button" data-trail-name="${escapeHtml(trail.name || '')}" aria-label="${favoriteAriaLabel}" title="${favoriteAriaLabel}">${favoriteButtonLabel}</button>
                <button class="trail-link button button--secondary" type="button" data-trail-name="${escapeHtml(trail.name || '')}" aria-label="Plan ${trailName}">Plan hike</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = cardsMarkup;
}
