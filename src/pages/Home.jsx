import Header from "../components/Header"
import SearchBar from "../components/SearchBar"

function Home() {
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

          <SearchBar />
        </section>

        <section className="results">
          {/* Les résultats seront affichés ici */}
        </section>
      </main>
    </>
  )
}

export default Home