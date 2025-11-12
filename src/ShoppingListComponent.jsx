import { PANTRY_STAPLES } from './constants/pantry.js';

function ShoppingListComponent({ recipes }) {
  // Helper function to check if an item is a pantry staple (case-insensitive)
  const isPantryItem = (itemName) => {
    const nameLower = itemName.toLowerCase().trim();
    return PANTRY_STAPLES.some(staple => 
      nameLower === staple.toLowerCase() || nameLower.includes(staple.toLowerCase())
    );
  };

  // Helper function to combine duplicate ingredients
  const combineIngredients = (ingredients) => {
    const ingredientMap = new Map();
    
    ingredients.forEach(ingredient => {
      const normalizedName = ingredient.name.trim();
      
      if (ingredientMap.has(normalizedName)) {
        // Combine measures if duplicate
        const existing = ingredientMap.get(normalizedName);
        const existingMeasure = existing.measure ? existing.measure.trim() : '';
        const newMeasure = ingredient.measure ? ingredient.measure.trim() : '';
        
        if (existingMeasure && newMeasure) {
          existing.measure = `${existingMeasure} + ${newMeasure}`;
        } else if (newMeasure) {
          existing.measure = newMeasure;
        }
      } else {
        ingredientMap.set(normalizedName, {
          name: normalizedName,
          measure: ingredient.measure ? ingredient.measure.trim() : ''
        });
      }
    });
    
    return Array.from(ingredientMap.values());
  };

  // Create master list of all ingredients from all recipes
  const allIngredients = [];
  recipes.forEach(recipe => {
    if (recipe.ingredients) {
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.name && ingredient.name.trim()) {
          allIngredients.push({
            name: ingredient.name,
            measure: ingredient.measure || ''
          });
        }
      });
    }
  });

  // Separate ingredients into fresh and pantry
  const freshIngredientsList = [];
  const pantryChecklist = [];
  
  allIngredients.forEach(ingredient => {
    if (isPantryItem(ingredient.name)) {
      pantryChecklist.push(ingredient);
    } else {
      freshIngredientsList.push(ingredient);
    }
  });

  // Combine duplicates for both lists
  const freshIngredients = combineIngredients(freshIngredientsList);
  const pantryChecklistCombined = combineIngredients(pantryChecklist);

  const styles = {
    container: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    },
    title: {
      fontSize: '24px',
      fontWeight: '400',
      color: '#2d5016',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #a8c98f',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      marginBottom: '30px',
    },
    listItem: {
      padding: '10px 0',
      fontSize: '16px',
      color: '#555',
      borderBottom: '1px solid #e8e8e8',
    },
    listItemLast: {
      borderBottom: 'none',
    },
    ingredientName: {
      fontWeight: '500',
      color: '#4a6741',
    },
    measure: {
      color: '#777',
      marginLeft: '8px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Shopping List</h2>
      <ul style={styles.list}>
        {freshIngredients.map((item, index) => (
          <li 
            key={index} 
            style={{
              ...styles.listItem,
              ...(index === freshIngredients.length - 1 ? styles.listItemLast : {})
            }}
          >
            <span style={styles.ingredientName}>{item.name}</span>
            {item.measure && <span style={styles.measure}>({item.measure})</span>}
          </li>
        ))}
      </ul>

      <h2 style={styles.title}>Pantry Check</h2>
      <ul style={styles.list}>
        {pantryChecklistCombined.map((item, index) => (
          <li 
            key={index} 
            style={{
              ...styles.listItem,
              ...(index === pantryChecklistCombined.length - 1 ? styles.listItemLast : {})
            }}
          >
            <span style={styles.ingredientName}>{item.name}</span>
            {item.measure && <span style={styles.measure}>({item.measure})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingListComponent;
