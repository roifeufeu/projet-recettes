import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { getRecipeById } from "../services/recipeApi"

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
    <main className="recipe-page">
      <h1>{recipe.title}</h1>

      <img
        src={recipe.image}
        alt={recipe.title}
      />

      <p>
        Portions : {recipe.servings}
      </p>

      <section>
        <h2>Ingrédients</h2>

        <ul>
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.original}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Recipe