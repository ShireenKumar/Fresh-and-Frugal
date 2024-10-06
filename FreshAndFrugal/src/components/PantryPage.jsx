import React, { useEffect, useState } from 'react';
import { getFirestore } from "firebase/firestore";
import { getUserPantry } from './firebaseConfig.ts';

const PantryPage = ({  }) => {
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const db = getFirestore(); // Initialize Firestore
  
    useEffect(() => {
      const fetchPantryItems = async () => {
        try {
          const items = await getUserPantry(db, 'bj9mMmlwXyU2fCLDVxInYjdWMEQ2');
          setPantryItems(items);
        } catch (err) {
          setError("Error fetching pantry items");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPantryItems();
    }, ['bj9mMmlwXyU2fCLDVxInYjdWMEQ2', db]); // Run this effect when userId changes
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <div>
        <h3>View the full list of your ingredients here: </h3>
        {pantryItems.length > 0 ? (
          <ul>
            {pantryItems.map(item => (
              <li key={item.id}>
                <strong>{item.name}</strong><br />
                Expiration Date: {item.expirationDate}<br />
                Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Your pantry is empty!</p>
        )}
      </div>
    );
  };
  
  export default PantryPage;
