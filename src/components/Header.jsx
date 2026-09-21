import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Projet Recettes
      </Link>

      <nav className="nav">
        <a href="#">Favoris</a>
        <a href="#">Historique</a>

        <button className="login-button">
          Connexion
        </button>
      </nav>
    </header>
  )
}

export default Header