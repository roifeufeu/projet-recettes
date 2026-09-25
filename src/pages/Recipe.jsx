import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import { getRecipeById } from "../services/recipeApi";

function formatAmount(amount) {
  if (amount >= 100) {
    return Math.round(amount);
  }

  if (Number.isInteger(amount)) {
    return amount;
  }

  return Math.round(amount * 10) / 10;
}

function formatUnit(unit) {
  if (!unit) {
    return "";
  }

  const normalizedUnit = unit.toLowerCase();

  const units = {
    tsp: "cuillère à café",
    tsps: "cuillères à café",

    tbsp: "cuillère à soupe",
    tbsps: "cuillères à soupe",

    cup: "tasse",
    cups: "tasses",

    serving: "portion",
    servings: "portions",

    piece: "pièce",
    pieces: "pièces",

    large: "grande",
    small: "petite",
    medium: "moyenne",

    g: "g",
    kg: "kg",
    ml: "ml",
    l: "l",
  };

  return units[normalizedUnit] || unit;
}

function Recipe() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id);

        setRecipe(data);
      } catch (error) {
        console.error(error);
        setError(
          "La recette n'a pas pu être chargée. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />

        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement de la recette...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="recipe-page">
          <div className="error-state">
            <strong>Impossible de charger la recette</strong>
            <p>{error}</p>
          </div>
        </main>
      </>
    );
  }

  if (!recipe) {
    return <p>Recette introuvable.</p>;
  }

  return (
    <>
      <Header />

      <main className="recipe-page">
        <section className="recipe-header">
          <img className="recipe-image" src={recipe.image} alt={recipe.title} />

          <div className="recipe-summary">
            <h1>{recipe.title}</h1>

            <p>
              <strong>Portions :</strong> {recipe.servings}
            </p>

            {recipe.readyInMinutes && (
              <p>
                <strong>Temps :</strong> {recipe.readyInMinutes} min
              </p>
            )}
          </div>
        </section>

        <section className="recipe-section">
          <h2>Ingrédients</h2>

          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.id}-${index}`}>
                <strong>{ingredient.name}</strong>

                {ingredient.amount != null && (
                  <>
                    {" — "}
                    {formatAmount(ingredient.amount)}{" "}
                    {formatUnit(ingredient.unit)}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {recipe.nutrition.length > 0 && (
          <section className="recipe-section">
            <h2>Nutrition</h2>

            <div className="nutrition-grid">
              {recipe.nutrition.map((nutrient) => (
                <div className="nutrition-item" key={nutrient.name}>
                  <strong>{nutrient.name}</strong>

                  <span>
                    {Math.round(nutrient.amount)} {nutrient.unit}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default Recipe;
