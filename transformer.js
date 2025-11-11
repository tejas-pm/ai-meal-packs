function transformRecipe(apiRecipe) {
  const ingredients = [];
  
  // Loop through ingredients 1-20
  for (let i = 1; i <= 20; i++) {
    const ingredient = apiRecipe[`strIngredient${i}`];
    const measure = apiRecipe[`strMeasure${i}`];
    
    // Check if ingredient exists and is not empty
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        name: ingredient,
        measure: measure || '' // Use empty string if measure is null/undefined
      });
    }
  }
  
  return {
    recipeId: apiRecipe.idMeal,
    recipeName: apiRecipe.strMeal,
    cuisine: apiRecipe.strCategory,
    serves: 2,
    allergens: [],
    imageUrl: apiRecipe.strMealThumb,
    sourceUrl: apiRecipe.strSource,
    ingredients: ingredients,
    instructions: apiRecipe.strInstructions
  };
}

module.exports = { transformRecipe };

