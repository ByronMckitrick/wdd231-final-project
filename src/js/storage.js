const STORAGE_KEY = 'favoriteTrails';

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
