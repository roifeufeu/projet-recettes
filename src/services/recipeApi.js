const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=27&offset=${offset}&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des recettes");
  }

  const data = await response.json();

  return data;
}

export async function getRecipeById(id) {
  const response = await fetch(
    `${BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la recette");
  }

  const data = await response.json();

  return data;
}
