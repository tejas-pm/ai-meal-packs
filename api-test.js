const { transformRecipe } = require('./transformer');

async function getRecipe() {
  try {
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata';
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.meals && data.meals.length > 0) {
      const transformedRecipe = transformRecipe(data.meals[0]);
      console.log(transformedRecipe);
    } else {
      console.log('No recipes found');
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
  }
}

getRecipe();
