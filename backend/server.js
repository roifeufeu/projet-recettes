import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

app.get("/api/test", (req, res) => {
  res.json({
    message: "Le backend fonctionne !",
  });
});

app.get("/api/recipes/search", async (req, res) => {
  const query = req.query.q;
  const offset = req.query.offset || 0;

  if (!query) {
    return res.status(400).json({
      error: "Le paramètre q est obligatoire.",
    });
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=27&offset=${offset}&apiKey=${SPOONACULAR_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Erreur Spoonacular");
    }

    const data = await response.json();

    const recipes = data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    }));

    res.json({
      results: recipes,
      totalResults: data.totalResults,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Impossible de récupérer les recettes.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

app.get("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Erreur Spoonacular");
    }

    const data = await response.json();

    const recipe = {
      id: data.id,
      title: data.title,
      image: data.image,
      servings: data.servings,
      readyInMinutes: data.readyInMinutes,

      ingredients: data.extendedIngredients.map((ingredient) => {
        const metric = ingredient.measures?.metric;

        return {
          id: ingredient.id,
          name: ingredient.nameClean || ingredient.name,
          amount: metric?.amount ?? ingredient.amount,
          unit: metric?.unitShort || ingredient.unit || "",
        };
      }),

      nutrition:
        data.nutrition?.nutrients
          ?.filter((nutrient) =>
            [
              "Calories",
              "Protein",
              "Fat",
              "Carbohydrates",
              "Sugar",
              "Fiber",
              "Sodium",
            ].includes(nutrient.name),
          )
          .map((nutrient) => ({
            name: nutrient.name,
            amount: nutrient.amount,
            unit: nutrient.unit,
          })) || [],
    };

    res.json(recipe);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Impossible de récupérer la recette.",
    });
  }
});
