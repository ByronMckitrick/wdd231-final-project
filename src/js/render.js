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

export function renderTrailCards(trails, container) {
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

      return `
        <article class="trail-card">
          <div class="trail-image"></div>
          <div class="trail-content">
            <div class="trail-top">
              <h3>${trail.name}</h3>
              <span class="badge ${badgeClass}">${trail.difficulty}</span>
            </div>
            <p>${trail.description}</p>
            <ul class="trail-meta">
              <li>${distanceMiles} mi</li>
              <li>${elevationFeet} ft</li>
              <li>${location}</li>
            </ul>
            <div class="trail-actions">
              <div class="trail-actions__buttons">
                <button class="button button--secondary favorite-button" type="button">Favorite</button>
                <button class="trail-link button button--secondary" type="button">Plan hike</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  container.innerHTML = cardsMarkup;
}
