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

  async function handleSearch(query) {
    setSearch(query)
    setLoading(true)
    setError("")

    try {
      const results = await searchRecipes(query)
      setRecipes(results)
    } catch (error) {
      console.error(error)
      setError("Impossible de récupérer les recettes.")
      setRecipes([])
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
            <h2>Résultats pour "{search}"</h2>

            {loading && <p>Recherche en cours...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && recipes.length > 0 && (
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

                <button className="load-more">
                  Voir plus
                </button>
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