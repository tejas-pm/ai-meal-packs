import React from 'react';

function RecipeCard({ recipe }) {
  const styles = {
    card: {
      border: '1px solid #ddd',
      borderRadius: '12px',
      overflow: 'hidden', // Ensures image corners are rounded
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
    },
    image: {
      width: '100%',
      height: '180px', // Give a fixed height
      objectFit: 'cover', // Prevents stretching
    },
    content: {
      padding: '16px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 8px 0',
    },
    cuisine: {
      fontSize: '14px',
      color: '#6b8e4f', // Our green theme color
      margin: '0',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.card}>
      <img 
        src={recipe.imageUrl} 
        alt={recipe.recipeName} 
        style={styles.image} 
      />
      <div style={styles.content}>
        <h2 style={styles.title}>{recipe.recipeName}</h2>
        <p style={styles.cuisine}>{recipe.cuisine}</p>
      </div>
    </div>
  );
}

export default RecipeCard;