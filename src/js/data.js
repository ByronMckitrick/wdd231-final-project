export async function getTrails() {
  const response = await fetch(new URL('../idahoTrails.json', import.meta.url));

  if (!response.ok) {
    throw new Error(`Unable to load trail data: ${response.status}`);
  }

  const trails = await response.json();
  return Array.isArray(trails) ? trails : [];
}
