// import { useState, useEffect } from "react";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Firestore functions
// import { db } from "../firebaseConfig"; // Use your Firebase config
// import { Input } from "@/components/ui/input"; // Assuming you're using ShadCN UI Input component
// import { Button } from "@/components/ui/button"; // Assuming ShadCN UI button component

// export default function ReceiptVerification() {
//   const [ingredients, setIngredients] = useState([]); // List of ingredients from OCR
//   const [editedIngredients, setEditedIngredients] = useState([]); // State to track edited ingredients

//   // Fetch ingredients from Firebase (assumed pre-scanned receipt data)
//   useEffect(() => {
//     const fetchPantryIngredients = async () => {
//       try {
//         const pantryCollection = collection(db, "UserPantry"); // Collection path for user pantry
//         const pantrySnapshot = await getDocs(pantryCollection);
//         const pantryItems = pantrySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setIngredients(pantryItems);
//         setEditedIngredients(pantryItems); // Initialize edited ingredients with original data
//       } catch (error) {
//         console.error("Error fetching pantry ingredients: ", error);
//       }
//     };

//     fetchPantryIngredients();
//   }, []);

//   // Handle editing ingredient names or expiration dates
//   const handleEdit = (index, field, value) => {
//     const updatedIngredients = [...editedIngredients];
//     updatedIngredients[index][field] = value;
//     setEditedIngredients(updatedIngredients);
//   };

//   // Function to update pantry ingredients in Firebase
//   const updatePantry = async () => {
//     try {
//       for (let ingredient of editedIngredients) {
//         const ingredientRef = doc(db, "UserPantry", ingredient.id); // Reference to specific doc
//         await updateDoc(ingredientRef, {
//           name: ingredient.name,
//           expirationDate: ingredient.expirationDate, // Update both name and expiration date
//         });
//       }
//       console.log("Pantry updated successfully!");
//     } catch (error) {
//       console.error("Error updating pantry: ", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Verify Ingredients</h2>
//       {ingredients.length === 0 ? (
//         <p>No ingredients found.</p>
//       ) : (
//         <div className="space-y-4">
//           {editedIngredients.map((ingredient, index) => (
//             <div key={ingredient.id} className="flex space-x-4 items-center">
//               {/* Editable input for ingredient name */}
//               <Input
//                 type="text"
//                 value={ingredient.name}
//                 onChange={(e) => handleEdit(index, "name", e.target.value)}
//                 className="w-full"
//               />
//               {/* Editable input for expiration date */}
//               <Input
//                 type="date"
//                 value={ingredient.expirationDate}
//                 onChange={(e) => handleEdit(index, "expirationDate", e.target.value)}
//                 className="w-full"
//               />
//               {/* Placeholder edit button */}
//               <Button>Edit</Button>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Submit button to update the pantry */}
//       <div className="mt-4">
//         <Button onClick={updatePantry}>Submit Updates</Button>
//       </div>
//     </div>
//   );
// }
