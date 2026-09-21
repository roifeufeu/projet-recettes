import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import Header from "../components/Header"
import { getRecipeById } from "../services/recipeApi"

function formatAmount(amount) {
  if (amount >= 100) {
    return Math.round(amount)
  }

  if (Number.isInteger(amount)) {
    return amount
  }

  return Math.round(amount * 10) / 10
}

function formatUnit(unit) {
  const units = {
    tsp: "cuillere à café",
    tbsp: "cuillere à soupe",
    cup: "tasse",
    cups: "tasses",
    large: "grande",
    small: "petite",
    medium: "moyenne",
  }

  return units[unit] || unit
}

function Recipe() {
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await getRecipeById(id)

        setRecipe(data)
      } catch (error) {
        console.error(error)
        setError("Impossible de récupérer la recette.")
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  if (loading) {
    return <p>Chargement de la recette...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!recipe) {
    return <p>Recette introuvable.</p>
  }

  return (
    <>
      <Header />

      <main className="recipe-page">
        <section className="recipe-header">
          <img
            className="recipe-image"
            src={recipe.image}
            alt={recipe.title}
          />

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
            {recipe.extendedIngredients.map((ingredient, index) => {
              const metric = ingredient.measures?.metric

              return (
                <li key={`${ingredient.id}-${index}`}>
                  <strong>{ingredient.name}</strong>

                  {metric && (
                    <>
                      {" — "}
                      {formatAmount(metric.amount)} {formatUnit(metric.unitShort)}
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {recipe.instructions && (
          <section className="recipe-section">
            <h2>Instructions</h2>

            <div
              className="recipe-instructions"
              dangerouslySetInnerHTML={{
                __html: recipe.instructions,
              }}
            />
          </section>
        )}
      </main>
    </>
  )
}

export default Recipe