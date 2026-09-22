const BASE_URL = "http://localhost:3000";

export async function searchRecipes(query, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/api/recipes/search?q=${encodeURIComponent(query)}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des recettes");
  }

  const data = await response.json();

  return data;
}

export async function getRecipeById(id) {
  const response = await fetch(`${BASE_URL}/api/recipes/${id}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la recette");
  }

  const data = await response.json();

  return data;
}
