function ShoppingListComponent({ recipes }) {
  const pantryStaples = ["salt", "water", "olive oil", "vegetable oil", "sugar", "plain flour", "pepper", "black pepper", "garam masala", "cumin", "coriander", "paprika", "ginger", "garlic", "onions", "onion", "tomatoes"];

  // Create master list of all ingredients from all recipes
  const allIngredients = [];
  recipes.forEach(recipe => {
    if (recipe.ingredients) {
      recipe.ingredients.forEach(ingredient => {
        allIngredients.push({
          name: ingredient.name,
          measure: ingredient.measure || ''
        });
      });
    }
  });

  // Filter out pantry staples and combine duplicates
  const ingredientMap = new Map();
  
  allIngredients.forEach(ingredient => {
    const nameLower = ingredient.name.toLowerCase().trim();
    
    // Check if it's a pantry staple (case-insensitive)
    const isPantryStaple = pantryStaples.some(staple => 
      nameLower === staple.toLowerCase() || nameLower.includes(staple.toLowerCase())
    );
    
    if (!isPantryStaple && nameLower) {
      // Normalize the name (capitalize first letter)
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
    }
  });

  // Convert map to array for rendering
  const shoppingList = Array.from(ingredientMap.values());

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
        {shoppingList.map((item, index) => (
          <li 
            key={index} 
            style={{
              ...styles.listItem,
              ...(index === shoppingList.length - 1 ? styles.listItemLast : {})
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

