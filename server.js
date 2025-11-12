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
// POST endpoint (v2.1 - Multi-Cuisine)
app.post('/api/generatePacks', async (req, res) => {
    try {
      const { cuisines, allergies } = req.body;
      
      if (!cuisines || cuisines.length === 0) {
        return res.status(400).json({ error: 'No cuisines selected' });
      }
  
      console.log('User selected cuisines:', cuisines); // Debug log
  
      // 1. Get meal lists for ALL selected cuisines in parallel
      const mealListPromises = cuisines.map(cuisine => {
        const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`;
        console.log(`Fetching meal list from: ${filterUrl}`); // <-- THE KEY LOG
        return fetch(filterUrl).then(res => res.json());
      });
  
      const mealListResponses = await Promise.all(mealListPromises);
  
      // Flatten all the meal arrays into one big list
      const allMeals = mealListResponses.flatMap(response => response.meals || []);
      
      // De-duplicate in case "Indian" and "Thai" return the same recipe
      const uniqueMeals = Array.from(new Map(allMeals.map(meal => [meal.idMeal, meal])).values());
      
      // Get the first 25 recipes (our AI's limit)
      const twentyFiveMeals = uniqueMeals.slice(0, 25);
      console.log(`Fetched ${uniqueMeals.length} unique meals, hydrating 25...`);
  
      // 2. "Hydrate" those 25 meals in parallel
      const recipePromises = twentyFiveMeals.map(meal => getRecipeDetails(meal.idMeal));
      const fullRecipes = await Promise.all(recipePromises);
  
      // 3. NEW: Give the 25 recipes to the AI
      const prompt = `
        You are an expert chef who designs 5 waste-free meal packs.
        Here are 25 recipes (in JSON format): ${JSON.stringify(fullRecipes)}
        Here are the user's allergies: ${JSON.stringify(allergies)}
  
        Your task:
        1.  First, filter out any recipes that contain any of the user's allergies.
        2.  From the remaining recipes, create 5 *different* 3-recipe packs.
        3.  Each 3-recipe pack *must* be optimized for "maximum fresh ingredient overlap" (at least 50%).
        4.  Respond *only* with a JSON array of the 5 packs. Each pack object should have a "recipes" key containing an array of the 3 chosen recipe objects.
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      // Clean the AI's response to extract only the JSON
      const jsonMatch = text.match(/```json([\s\S]*?)```/);
      const cleanedText = jsonMatch ? jsonMatch[1] : text;
  
      // 4. Send the AI's 5-pack to the frontend
      res.json(JSON.parse(cleanedText));
  
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