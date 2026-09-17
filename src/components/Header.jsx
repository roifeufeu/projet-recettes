function Header() {
  return (
    <header className="header">
      <div className="logo">
        Projet Recettes
      </div>

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