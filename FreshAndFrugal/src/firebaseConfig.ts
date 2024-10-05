// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { CollectionReference, DocumentData, Firestore, Query, addDoc, collection, connectFirestoreEmulator, doc, getDoc, 
  getDocs, getFirestore, onSnapshot, query, 
  where, DocumentReference} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGERENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Creating an instance of FireStore and Accessing Data
const firestore = getFirestore(); // initializes firestore with default settings
connectFirestoreEmulator(firestore, 'localhost', 8080);

/*
Adds a new document for any collection with the given data.
*/
async function addNewDocument(collectionRef: CollectionReference<any, DocumentData>, data: any) {
  try {
    const newDoc = await addDoc(collectionRef, data);
    console.log(`Your document was created at ${newDoc.path}`);
    return newDoc;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

/*
Reads a document from the given collection and doc ID.
*/

async function readDocument(collectionRef: Firestore, docId: string) {
  try {
    const docRef = doc(collectionRef, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`Document data: `, docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error reading document: ", error);
  }
}

/*
Listens to the given doc from the collection, using the inputted callback function
to handle the returned data.
*/
function listenToDocument(collectionRef: Firestore, docId: string, callback: Function) {
  const docRef = doc(collectionRef, docId);

  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      console.log("Current data: ", docSnap.data());
      callback(docSnap.data());
    } else {
      console.log("No such document!");
    }
  }, (error) => {
    console.error("Error listening to document: ", error);
  });

  // Return the unsubscribe function to stop listening when necessary
  return unsubscribe;
}

/*
Queries for a document from the given collection based on the given query conditions.
*/
async function queryDocuments(collectionRef: Query<unknown, DocumentData>, conditions: any[]) {
  try {
    // Build the query dynamically based on the conditions
    const q = query(
      collectionRef,
      ...conditions.map(cond => where(cond.field, cond.operator, cond.value))
    );
    
    const querySnapshot = await getDocs(q);
    
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() || {}}));
    
    console.log("Queried documents: ", documents);
    
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
  }


}

// Function to read all pantry items for a user
async function getUserPantry(db: Firestore, userId: string) {
    try {
      // Step 1: Get the user document
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        // Step 2: Get the pantry reference field from the user document
        const pantryRef = userDocSnap.data().pantry as DocumentReference;
  
        if (pantryRef) {
          // Step 3: Get all food items from the pantry collection referenced by the pantryRef
          const pantrySnapshot = await getDocs(collection(db, pantryRef.path)); // Fetch all docs in the referenced pantry collection
  
          // Step 4: Process each food item and return the data
          const pantryItems = pantrySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log("Pantry Items: ", pantryItems);
          return pantryItems; // Return the array of pantry items
        } else {
          console.log("No pantry reference found for the user.");
          return [];
        }
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error reading user's pantry: ", error);
    }
  }