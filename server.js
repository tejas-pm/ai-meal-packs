import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // 'import' is correct here
import { transformRecipe } from './transformer.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; // To load the .env file

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to get recipe details
async function getRecipeDetails(mealId) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  const response = await fetch(url);
  const data = await response.json();
  const messyRecipe = data.meals[0];
  const cleanRecipe = transformRecipe(messyRecipe);
  return cleanRecipe;
}

// POST endpoint
app.post('/api/generatePacks', async (req, res) => {
  try {
    const { cuisines, allergies } = req.body; // We need allergies now

    if (!cuisines || cuisines.length === 0) {
      return res.status(400).json({ error: 'No cuisines selected' });
    }

    // 1. Get 5 Full Recipes (Same as before)
    const category = cuisines[0];
    const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${category}`;
    const listResponse = await fetch(filterUrl);
    const listData = await listResponse.json();
    const meals = listData.meals || [];
    const fiveMeals = meals.slice(0, 5);
    const recipePromises = fiveMeals.map(meal => getRecipeDetails(meal.idMeal));
    const fullRecipes = await Promise.all(recipePromises);

    // 2. NEW: Give the 5 recipes to the AI
    const prompt = `
      You are an expert chef who designs waste-free meal packs.

      Here are 5 recipes (in JSON format): ${JSON.stringify(fullRecipes)}

      Here are the user's allergies: ${JSON.stringify(allergies)}

      Your task:
      1. First, filter out any recipes that contain any of the user's allergies.
      2. From the *remaining* recipes, find the best *3* that create a "waste-free" pack, meaning they share common fresh ingredients (like onions, garlic, tomatoes).
      3. **Important:** Respond *only* with a JSON array of the 3 chosen recipe objects. Do not add any other text or explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // NEW: Clean the AI's response to extract only the JSON
    // It often wraps JSON in ```json ... ```
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    
    // Use the matched JSON if found, otherwise assume the whole text is JSON
    const cleanedText = jsonMatch ? jsonMatch[1] : text;
    
    // 3. Send the AI's 3-pack to the frontend
    res.json(JSON.parse(cleanedText)); // Parse the CLEANED text

  } catch (error) {
    console.error('Error generating AI pack:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});