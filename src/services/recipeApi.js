const BASE_URL = "http://localhost:3000";

export async function searchRecipes(query, offset = 0) {
  console.count("searchRecipes appelé");
  const response = await fetch(
    `${BASE_URL}/api/recipes/search?q=${encodeURIComponent(query)}&offset=${offset}`,
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(data.error || "Erreur lors de la recherche des recettes");
  }

  return response.json();
}

export async function getRecipeById(id) {
  const response = await fetch(`${BASE_URL}/api/recipes/${id}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || "Erreur lors de la récupération de la recette",
    );
  }

  return response.json();
}
