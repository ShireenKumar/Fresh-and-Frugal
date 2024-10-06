import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebaseConfig.ts"; // Use the exported Firestore instance

export default function OcrComponent() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [ingredients, setIngredients] = useState([]); // State to store standard ingredients list

  // Fetch standard ingredient list from Firebase
  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredientsCollection = collection(db, "StandardIngredients");
      const ingredientSnapshot = await getDocs(ingredientsCollection);
      const ingredientList = ingredientSnapshot.docs.map(doc => doc.data().name); // Assuming each document has a 'name' field
      setIngredients(ingredientList);
    };

    fetchIngredients();
  }, []);

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
    try {
      const ingredientsCollection = collection(db, "User/Pantry"); // Change to your desired collection
      const newDocRef = await addDoc(ingredientsCollection, {
        matchedIngredients,
        timestamp: calculateExpirationDate(matchedIngredients.time, matchedIngredients.metric), // Add timestamp for record-keeping
      });

      console.log("Matched ingredients added to Firestore at: ", newDocRef.path);
    } catch (error) {
      console.error("Error adding matched ingredients to Firestore: ", error);
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
    <div>
      <h2>OCR with Tesseract.js</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={runOCR}>Extract Text</button>

      {progress > 0 && <p>Progress: {progress}%</p>}
      {text && <p>Extracted Text: {text}</p>}
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: "400px" }} />}
    </div>
  );
}
