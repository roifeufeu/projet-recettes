import { useState } from "react"

import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import RecipeCard from "../components/RecipeCard"

import { searchRecipes } from "../services/recipeApi"

function Home() {
  const [search, setSearch] = useState("")
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [offset, setOffset] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  async function handleSearch(query) {
    setSearch(query)
    setLoading(true)
    setError("")
    setOffset(0)

    try {
      const data = await searchRecipes(query, 0)

      setRecipes(data.results)
      setTotalResults(data.totalResults)
    } catch (error) {
      console.error(error)

      setError("Impossible de récupérer les recettes.")
      setRecipes([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

async function handleLoadMore() {
  const newOffset = offset + 9

  console.log("Voir plus cliqué")
  console.log("Recherche :", search)
  console.log("Nouvel offset :", newOffset)

  setLoading(true)
  setError("")

  try {
    const data = await searchRecipes(search, newOffset)

    console.log("Réponse Spoonacular :", data)
    console.log("Nouveaux résultats :", data.results)

    setRecipes((currentRecipes) => [
      ...currentRecipes,
      ...data.results,
    ])

    setOffset(newOffset)
  } catch (error) {
    console.error(error)
    setError("Impossible de charger plus de recettes.")
  } finally {
    setLoading(false)
  }
}
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <h1>Trouvez la recette qu'il vous faut</h1>

          <p>
            Entrez le nom d'un plat pour découvrir ses ingrédients
            et les quantités nécessaires.
          </p>

          <SearchBar onSearch={handleSearch} />
        </section>

        {search && (
          <section className="results">
            <h2>
  Résultats pour "{search}" ({totalResults})
</h2>

            {loading && recipes.length === 0 && (
              <p>Recherche en cours...</p>
            )}

            {error && (
              <p>{error}</p>
            )}

            {!error && recipes.length > 0 && (
              <>
                <div className="results-grid">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      name={recipe.title}
                      image={recipe.image}
                    />
                  ))}
                </div>

                {recipes.length < totalResults && (
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
  )
}

export default Home