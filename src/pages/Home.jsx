import { useState } from "react"

import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import RecipeCard from "../components/RecipeCard"

const fakeRecipes = [
  {
    id: 1,
    name: "Poulet rôti",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435",
  },
  {
    id: 2,
    name: "Poulet curry",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
  },
  {
    id: 3,
    name: "Poulet teriyaki",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
  },
  {
    id: 4,
    name: "Poulet à la crème",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  },
  {
    id: 5,
    name: "Poulet tikka",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
  },
  {
    id: 6,
    name: "Poulet grillé",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b",
  },
  {
    id: 7,
    name: "Poulet au citron",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
  {
    id: 8,
    name: "Poulet épicé",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
  },
  {
    id: 9,
    name: "Poulet aux légumes",
    image: "https://images.unsplash.com/photo-1543353071-873f17a7a088",
  },
]

function Home() {
  const [search, setSearch] = useState("")

  const filteredRecipes = fakeRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  )

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

          <SearchBar onSearch={setSearch} />
        </section>

        {search && (
          <section className="results">
            <h2>Résultats pour "{search}"</h2>

            {filteredRecipes.length > 0 ? (
              <>
                <div className="results-grid">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      name={recipe.name}
                      image={recipe.image}
                    />
                  ))}
                </div>

                <button className="load-more">
                  Voir plus
                </button>
              </>
            ) : (
              <p>Aucune recette trouvée.</p>
            )}
          </section>
        )}
      </main>
    </>
  )
}

export default Home