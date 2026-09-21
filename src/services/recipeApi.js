const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=9&offset=${offset}&sort=popularity&sortDirection=desc&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des recettes");
  }

  const data = await response.json();

  return data;
}
