import { useState } from "react";

function SearchBar() {
  const [search, setSearch] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Recherche :", search);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ex : poulet, lasagnes, carbonara..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <button type="submit">Rechercher</button>
    </form>
  );
}

export default SearchBar;
