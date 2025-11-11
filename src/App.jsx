import { useState } from 'react';

function App() {
  const [cuisines, setCuisines] = useState({
    Indian: false,
    Italian: false,
    Thai: false,
    Mexican: false,
  });

  const [allergies, setAllergies] = useState({
    Dairy: false,
    Gluten: false,
    Nuts: false,
  });

  const handleCuisineChange = (cuisine) => {
    setCuisines(prev => ({
      ...prev,
      [cuisine]: !prev[cuisine]
    }));
  };

  const handleAllergyChange = (allergy) => {
    setAllergies(prev => ({
      ...prev,
      [allergy]: !prev[allergy]
    }));
  };

  const handleSaveProfile = async () => {
    const selectedCuisines = Object.keys(cuisines).filter(cuisine => cuisines[cuisine]);
    const selectedAllergies = Object.keys(allergies).filter(allergy => allergies[allergy]);
    
    const profile = {
      cuisines: selectedCuisines,
      allergies: selectedAllergies
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Make POST request to server
    try {
      const response = await fetch('http://localhost:3001/api/generatePacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '32px',
      fontWeight: '300',
      color: '#2d5016',
      marginBottom: '30px',
      textAlign: 'center',
      letterSpacing: '1px',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#4a6741',
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: '2px solid #a8c98f',
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#555',
      padding: '8px',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease',
    },
    checkboxLabelHover: {
      backgroundColor: '#e8f5e3',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginRight: '12px',
      cursor: 'pointer',
      accentColor: '#6b8e4f',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '500',
      color: 'white',
      backgroundColor: '#6b8e4f',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.1s ease',
      marginTop: '20px',
    },
    buttonHover: {
      backgroundColor: '#5a7a3f',
      transform: 'translateY(-1px)',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Meal Profile</h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Cuisine Preferences</h2>
        <div style={styles.checkboxGroup}>
          {Object.keys(cuisines).map(cuisine => (
            <label
              key={cuisine}
              style={styles.checkboxLabel}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.checkboxLabelHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <input
                type="checkbox"
                checked={cuisines[cuisine]}
                onChange={() => handleCuisineChange(cuisine)}
                style={styles.checkbox}
              />
              {cuisine}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Allergies</h2>
        <div style={styles.checkboxGroup}>
          {Object.keys(allergies).map(allergy => (
            <label
              key={allergy}
              style={styles.checkboxLabel}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.checkboxLabelHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <input
                type="checkbox"
                checked={allergies[allergy]}
                onChange={() => handleAllergyChange(allergy)}
                style={styles.checkbox}
              />
              {allergy}
            </label>
          ))}
        </div>
      </div>

      <button
        style={styles.button}
        onClick={handleSaveProfile}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
          e.currentTarget.style.transform = styles.buttonHover.transform;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
          e.currentTarget.style.transform = 'none';
        }}
      >
        Save Profile
      </button>
    </div>
  );
}

export default App;
