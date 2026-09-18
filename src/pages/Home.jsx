import Header from "../components/Header"
import SearchBar from "../components/SearchBar"

function Home() {
  return (
    <>
      <Header />

      <main>
        <h1>Trouvez la recette qu'il vous faut</h1>

        <p>
          Entrez le nom d'un plat pour découvrir ses ingrédients
          et les quantités nécessaires.
        </p>

        <SearchBar />
      </main>
    </>
  )
}

export default Home