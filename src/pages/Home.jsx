import { useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";

import { searchRecipes } from "../services/recipeApi";

function Home() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  async function handleSearch(query) {
    setSearch(query);
    setLoading(true);
    setError("");

    setRecipes([]);
    setVisibleCount(9);
    setTotalResults(0);

    try {
      const data = await searchRecipes(query, 0);

      setRecipes(data.results);
      setTotalResults(data.totalResults);
    } catch (error) {
      console.error(error);

      setError("Impossible de récupérer les recettes.");
      setRecipes([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    // Il reste déjà des recettes chargées en mémoire :
    // aucune requête API nécessaire.
    if (visibleCount < recipes.length) {
      setVisibleCount((current) => Math.min(current + 9, recipes.length));

      return;
    }

    // Toutes les recettes récupérées sont déjà affichées
    // et il n'existe rien d'autre côté Spoonacular.
    if (recipes.length >= totalResults) {
      return;
    }

    // Il faut récupérer le prochain lot de 27 recettes.
    setLoading(true);
    setError("");

    try {
      const data = await searchRecipes(search, recipes.length);

      if (data.results.length === 0) {
        setTotalResults(recipes.length);
        return;
      }

      setRecipes((currentRecipes) => [...currentRecipes, ...data.results]);

      // On n'affiche que 9 recettes du nouveau lot.
      setVisibleCount((current) => current + 9);
    } catch (error) {
      console.error(error);

      setError("Impossible de charger plus de recettes.");
    } finally {
      setLoading(false);
    }
  }

  const visibleRecipes = recipes.slice(0, visibleCount);

  const hasMoreRecipes =
    visibleCount < recipes.length || recipes.length < totalResults;

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <h1>Trouvez la recette qu'il vous faut</h1>

          <p>
            Entrez le nom d'un plat pour découvrir ses ingrédients et les
            quantités nécessaires.
          </p>

          <SearchBar onSearch={handleSearch} />
        </section>

        {search && (
          <section className="results">
            <h2>
              Résultats pour "{search}"{" "}
              <span className="result-count">({totalResults})</span>
            </h2>

            {loading && recipes.length === 0 && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Recherche des recettes...</p>
              </div>
            )}
            {error && <p>{error}</p>}

            {!error && recipes.length > 0 && (
              <>
                <div className="results-grid">
                  {visibleRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      id={recipe.id}
                      name={recipe.title}
                      image={recipe.image}
                    />
                  ))}
                </div>

                {hasMoreRecipes && (
                  <button
                    className="load-more"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? "Chargement..." : "Voir plus"}
                  </button>
                )}
              </>
            )}

            {!loading && !error && recipes.length === 0 && (
              <p>Aucune recette trouvée.</p>
            )}
          </section>
        )}
      </main>
    </>
  );
}

export default Home;
