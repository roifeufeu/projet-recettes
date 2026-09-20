function RecipeCard({ name, image }) {
  return (
    <article className="recipe-card" tabIndex="0">
      <img src={image} alt={name} />

      <div className="recipe-card-content">
        <h2>{name}</h2>

        <span className="recipe-link">
          Détails →
        </span>
      </div>
    </article>
  )
}

export default RecipeCard