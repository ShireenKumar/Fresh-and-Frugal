// firestoreService.js
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


// Fetch ingredients from Firestore
export const fetchIngredients = async () => {
  const ingredientsCollection = collection(db, "SavedIngredients");
  const ingredientSnapshot = await getDocs(ingredientsCollection);
  const ingredientList = ingredientSnapshot.docs.map((doc) => doc.data().name);
  return ingredientList;
};

// Add matched ingredients to Firestore
export const addMatchedIngredients = async (userID, matchedIngredients, currentPantry) => {
  try {
    const userDocRef = doc(db, "Users", userID);
    const userDoc = await getDoc(userDocRef);

    let pantry = currentPantry || [];

    matchedIngredients.forEach((ingredient) => {
      const isInPantry = pantry.some((pantryItem) =>
        pantryItem.name.toLowerCase().includes(ingredient.toLowerCase())
      );

      if (!isInPantry) {
        const newIngredient = {
          name: ingredient,
          expirationDate: calculateExpirationDate(7, "days"), // Example expiration date
        };

        pantry.push(newIngredient);  // Update the local pantry array
      }
    });

    // Save the updated pantry to Firestore
    await setDoc(userDocRef, { pantry }, { merge: true });
  } catch (error) {
    console.error("Error updating pantry in Firestore: ", error);
  }
};

// Helper to calculate expiration date
export const calculateExpirationDate = (time, metric) => {
  const now = new Date();
  let expirationDate;

  switch (metric) {
    case "days":
      expirationDate = new Date(now.setDate(now.getDate() + time));
      break;
    case "months":
      expirationDate = new Date(now.setMonth(now.getMonth() + time));
      break;
    case "years":
      expirationDate = new Date(now.setFullYear(now.getFullYear() + time));
      break;
    default:
      expirationDate = now;
  }

  return expirationDate;
};


// // firestoreService.js
// import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import React, { useState, useEffect } from "react";

// // Fetch ingredients from Firestore
// export const fetchIngredients = async () => {
//   const ingredientsCollection = collection(db, "/SavedIngredients");
//   const ingredientSnapshot = await getDocs(ingredientsCollection);
//   const ingredientList = ingredientSnapshot.docs.map((doc) => doc.data().name);
//   return ingredientList;
// };

// const [pantry, setPantry] = useState([]); // Initial pantry state


// // Add matched ingredients to Firestore
// export const addMatchedIngredients = async (userID, matchedIngredients) => {
//   try {
//     const userDocRef = doc(db, "Users", userID);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       let pantry = userData.pantry || [];

//       matchedIngredients.forEach((ingredient) => {
//         const isInPantry = pantry.some((pantryItem) =>
//           pantryItem.name.toLowerCase().includes(ingredient.toLowerCase())
//         );

//         if (!isInPantry) {
//           const newIngredient = {
//             name: ingredient,
//             expirationDate: calculateExpirationDate(7, "days"), // Example expiration date
//           };

//           setPantry(prevPantry => [...prevPantry, newIngredient]);

//         }
//       });

//       await setDoc(userDocRef, { pantry }, { merge: true });
//     } else {
//       throw new Error("User document not found");
//     }
//   } catch (error) {
//     console.error("Error updating pantry in Firestore: ", error);
//   }
// };

// // Helper to calculate expiration date
// export const calculateExpirationDate = (time, metric) => {
//   const now = new Date();
//   let expirationDate;

//   switch (metric) {
//     case "days":
//       expirationDate = new Date(now.setDate(now.getDate() + time));
//       break;
//     case "months":
//       expirationDate = new Date(now.setMonth(now.getMonth() + time));
//       break;
//     case "years":
//       expirationDate = new Date(now.setFullYear(now.getFullYear() + time));
//       break;
//     default:
//       expirationDate = now;
//   }

//   return expirationDate;
// };
