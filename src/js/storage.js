const STORAGE_KEY = 'favoriteTrails';

const PLANNED_KEY = 'plannedHikes';

export function getStoredFavorites() {
  try {
    const storedFavorites = localStorage.getItem(STORAGE_KEY);

    if (!storedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(storedFavorites);

    return Array.isArray(parsedFavorites)
      ? parsedFavorites.map((trailName) => String(trailName || '').trim()).filter(Boolean)
      : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error(error);
  }
}

export function getPlannedHikes() {
  try {
    const stored = localStorage.getItem(PLANNED_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function savePlannedHikes(plans) {
  try {
    localStorage.setItem(PLANNED_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error(error);
  }
}

export function addPlannedHike(plan) {
  try {
    const plans = getPlannedHikes();
    const item = Object.assign({ id: Date.now() }, plan);
    plans.push(item);
    savePlannedHikes(plans);
    return item;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function removePlannedHike(id) {
  try {
    const plans = getPlannedHikes().filter((p) => p.id !== id);
    savePlannedHikes(plans);
    return plans;
  } catch (error) {
    console.error(error);
    return [];
  }
}
