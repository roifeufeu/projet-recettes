import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";
const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

async function translateText(text, source, target) {
  const response = await fetch(GOOGLE_TRANSLATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GOOGLE_TRANSLATE_API_KEY,
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: "text",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Erreur Google Translation :", errorData);

    throw new Error("Erreur Google Translation");
  }

  const data = await response.json();

  return data.data.translations[0].translatedText;
}

async function translateTexts(texts, source, target) {
  if (texts.length === 0) {
    return [];
  }

  const response = await fetch(GOOGLE_TRANSLATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GOOGLE_TRANSLATE_API_KEY,
    },
    body: JSON.stringify({
      q: texts,
      source,
      target,
      format: "text",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    console.error("Erreur Google Translation :", errorData);

    throw new Error("Erreur Google Translation");
  }

  const data = await response.json();

  return data.data.translations.map(
    (translation) => translation.translatedText,
  );
}

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
    const translatedQuery = await translateText(query, "fr", "en");

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(
        translatedQuery,
      )}&number=27&offset=${offset}&apiKey=${SPOONACULAR_API_KEY}`,
    );

    if (!response.ok) {
      if (response.status === 402) {
        return res.status(503).json({
          error: "Quota Spoonacular atteint. Réessaie plus tard.",
        });
      }

      const errorText = await response.text();

      console.error("Erreur Spoonacular :", errorText);

      throw new Error("Erreur Spoonacular");
    }

    const data = await response.json();

    const titles = data.results.map((recipe) => recipe.title);

    const translatedTitles = await translateTexts(titles, "en", "fr");

    const recipes = data.results.map((recipe, index) => ({
      id: recipe.id,
      title: translatedTitles[index],
      image: recipe.image,
    }));

    res.json({
      results: recipes,
      totalResults: data.totalResults,
    });
  } catch (error) {
    console.error("Erreur recherche :", error);

    res.status(500).json({
      error: "Impossible de récupérer les recettes.",
    });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`,
    );

    if (!response.ok) {
      if (response.status === 402) {
        return res.status(503).json({
          error: "Quota Spoonacular atteint. Réessaie plus tard.",
        });
      }

      const errorText = await response.text();

      console.error("Erreur Spoonacular :", errorText);

      throw new Error("Erreur Spoonacular");
    }

    const data = await response.json();

    const ingredientNames = data.extendedIngredients.map(
      (ingredient) => ingredient.nameClean || ingredient.name,
    );

    const textsToTranslate = [data.title, ...ingredientNames];

    const translatedTexts = await translateTexts(textsToTranslate, "en", "fr");

    const translatedTitle = translatedTexts[0];
    const translatedIngredients = translatedTexts.slice(1);

    const nutrientTranslations = {
      Calories: "Calories",
      Protein: "Protéines",
      Fat: "Lipides",
      Carbohydrates: "Glucides",
      Sugar: "Sucres",
      Fiber: "Fibres",
      Sodium: "Sodium",
    };

    const recipe = {
      id: data.id,
      title: translatedTitle,
      image: data.image,
      servings: data.servings,
      readyInMinutes: data.readyInMinutes,

      ingredients: data.extendedIngredients.map((ingredient, index) => {
        const metric = ingredient.measures?.metric;

        return {
          id: ingredient.id,
          name: translatedIngredients[index],
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
            name: nutrientTranslations[nutrient.name],
            amount: nutrient.amount,
            unit: nutrient.unit,
          })) || [],
    };

    res.json(recipe);
  } catch (error) {
    console.error("Erreur recette :", error);

    res.status(500).json({
      error: "Impossible de récupérer la recette.",
    });
  }
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Connexion PostgreSQL réussie",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error);

    res.status(500).json({
      error: "Connexion PostgreSQL impossible",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
