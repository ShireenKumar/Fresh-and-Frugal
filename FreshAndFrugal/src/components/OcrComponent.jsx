import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

import { doc, collection, getDoc, getDocs, addDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db, enablePersistence } from "../firebaseConfig.ts"; // Use the exported Firestore instance
import { useUserAuth } from "../context/userAuthContext";

export default function OcrComponent() {
  const { user } = useUserAuth();
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [ingredients, setIngredients] = useState([]); // State to store standard ingredients list

  // Fetch standard ingredient list from Firebase
  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientsCollection = collection(db, "/SavedIngredients");
      console.log(ingredientsCollection);
      const ingredientSnapshot = await getDocs(ingredientsCollection);
      const ingredientList = ingredientSnapshot.docs.map(doc => doc.data().name); // Assuming each document has a 'name' field
      setIngredients(ingredientList);
    };

    fetchIngredients();
  }, []);


  const fetchIngredients = async () => {
    try {
      const ingredientSnapshot = await getDocs(q); // Use the query here
      
      ingredientSnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };
  
  fetchIngredients();
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const runOCR = () => {
    if (!image) return;

    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      }
    })
      .then(({ data: { text } }) => {
        setText(text);
        processOCRText(text); // Process the OCR text after extraction
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Function to process OCR text and match ingredients
  const processOCRText = async (ocrText) => {
    const splitText = ocrText.split("\n"); // Split text by lines

    const matchedIngredients = splitText.filter((line) =>
      ingredients.some((ingredient) => line.toLowerCase().includes(ingredient.toLowerCase()))
    );

    console.log("Matched Ingredients: ", matchedIngredients);

    // Add matched ingredients to Firestore
    await addMatchedIngredients(matchedIngredients);
  };

  // Function to add matched ingredients to Firestore
  const addMatchedIngredients = async (matchedIngredients) => {
    console.log("adsasdf")
    try {
      // Assume currentUser is available from context or auth
      const userID = user?.uid; 
      if (!userID) {
        throw new Error("User not authenticated");
      }
  
      const userDocRef = doc(db, "Users", userID);
      const userDoc = await getDoc(userDocRef);
  
      console.log("FUCKKKKK", userDoc)

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let pantry = userData.pantry || []; // Initialize pantry if not available
  
        // Iterate over matched ingredients and check if they are already in the pantry
        matchedIngredients.forEach((ingredient) => {
          const isInPantry = pantry.some(pantryItem => 
            pantryItem.name.toLowerCase().includes(ingredient.toLowerCase())
          );

          console.log("THE INGREDIENTS SHOULD BE HERE IF NOT U R COOKED", ingredient)
  
          if (!isInPantry) {
            pantry.push({
              name: ingredient,
              expirationDate: calculateExpirationDate(7, 'days'), // Example: 7 days expiration
            });
          }
        });
  
        // Update the user's pantry in Firestore
        await setDoc(userDocRef, { pantry }, { merge: true });
        console.log("Pantry successfully updated with matched ingredients.");
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error updating pantry in Firestore: ", error);
    }
  };
  

  const calculateExpirationDate = (time, metric) => {
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
        expirationDate = now; // Default to now if no metric is provided
    }

    return expirationDate;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Upload your receipt!</h2>

      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={runOCR}
          className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          Extract Text
        </button>
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {text && <p className="mt-4 text-gray-700 text-lg">Extracted Text: {text}</p>}

      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="mt-4 max-w-xs rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}









// import { useState, useEffect } from "react";
// import Tesseract from "tesseract.js";
// import { fetchIngredients, addMatchedIngredients } from "../services/firestoreService";
// import { useUserAuth } from "../context/userAuthContext";

// export default function OcrComponent() {
//   const { user } = useUserAuth();
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [ingredients, setIngredients] = useState([]);

//   // Fetch ingredients when the component mounts
//   useEffect(() => {
//     const loadIngredients = async () => {
//       const ingredientList = await fetchIngredients();
//       setIngredients(ingredientList);
//     };

//     loadIngredients();
//   }, []);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   const runOCR = () => {
//     if (!image) return;

//     Tesseract.recognize(image, "eng", {
//       logger: (m) => {
//         if (m.status === "recognizing text") {
//           setProgress(Math.round(m.progress * 100));
//         }
//       },
//     })
//       .then(({ data: { text } }) => {
//         setText(text);
//         processOCRText(text);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   // Process OCR text and match with ingredients
//   const processOCRText = async (ocrText) => {
//     const splitText = ocrText.split("\n");

//     const matchedIngredients = splitText.filter((line) =>
//       ingredients.some((ingredient) => line.toLowerCase().includes(ingredient.toLowerCase()))
//     );

//     console.log("Matched Ingredients: ", matchedIngredients);

//     // Add matched ingredients to Firestore
//     if (user) {
//       await addMatchedIngredients(user.uid, matchedIngredients);
//     } else {
//       console.error("User not authenticated");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-gray-700">Upload your receipt!</h2>

//       <div className="flex flex-col items-center mb-4">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         <button
//           onClick={runOCR}
//           className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition-all"
//         >
//           Extract Text
//         </button>
//       </div>

//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
//           <div
//             className="bg-blue-600 h-4 rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}

//       {text && <p className="mt-4 text-gray-700 text-lg">Extracted Text: {text}</p>}

//       {image && (
//         <img
//           src={image}
//           alt="Uploaded"
//           className="mt-4 max-w-xs rounded-lg shadow-lg"
//         />
//       )}
//     </div>
//   );
// }






// OcrComponent.jsx
// import { useState, useEffect } from "react";
// import Tesseract from "tesseract.js";
// import { fetchIngredients, addMatchedIngredients } from "../services/firestoreService";
// import { useUserAuth } from "../context/userAuthContext";

// export default function OcrComponent() {
//   const { user } = useUserAuth();
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [ingredients, setIngredients] = useState([]);
//   const [pantry, setPantry] = useState([]); // Keep pantry state in the component

//   // Fetch ingredients when the component mounts
//   useEffect(() => {
//     const loadIngredients = async () => {
//       const ingredientList = await fetchIngredients();
//       setIngredients(ingredientList);
//     };

//     loadIngredients();
//   }, []);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   const runOCR = () => {
//     if (!image) return;

//     Tesseract.recognize(image, "eng", {
//       logger: (m) => {
//         if (m.status === "recognizing text") {
//           setProgress(Math.round(m.progress * 100));
//         }
//       },
//     })
//       .then(({ data: { text } }) => {
//         setText(text);
//         processOCRText(text);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   // Process OCR text and match with ingredients
//   const processOCRText = async (ocrText) => {
//     const splitText = ocrText.split("\n");

//     const matchedIngredients = splitText.filter((line) =>
//       ingredients.some((ingredient) => line.toLowerCase().includes(ingredient.toLowerCase()))
//     );

//     console.log("Matched Ingredients: ", matchedIngredients);

//     // Add matched ingredients to Firestore
//     if (user) {
//       await addMatchedIngredients(user.uid, matchedIngredients, pantry); // Pass current pantry to the service
//       setPantry((prevPantry) => [
//         ...prevPantry,
//         ...matchedIngredients.map((ingredient) => ({
//           name: ingredient,
//           expirationDate: calculateExpirationDate(7, "days"),
//         })),
//       ]);  // Update pantry locally
//     } else {
//       console.error("User not authenticated");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-gray-700">Upload your receipt!</h2>

//       <div className="flex flex-col items-center mb-4">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         <button
//           onClick={runOCR}
//           className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition-all"
//         >
//           Extract Text
//         </button>
//       </div>

//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
//           <div
//             className="bg-blue-600 h-4 rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}

//       {text && <p className="mt-4 text-gray-700 text-lg">Extracted Text: {text}</p>}

//       {image && (
//         <img
//           src={image}
//           alt="Uploaded"
//           className="mt-4 max-w-xs rounded-lg shadow-lg"
//         />
//       )}
//     </div>
//   );
// }
