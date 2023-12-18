import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  
} from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc ,getDoc} from "firebase/firestore";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    if (user) {
      // Call a function to save the user in the database
      saveUserToDatabase(user);
    }
  };

  const logOut = () => {
    signOut(auth);
    window.location.href = '/'
  };

  const saveUserToDatabase = async (user) => {
    // Check if the user already exists in the database
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, user.uid);
    const docSnapshot = await getDoc(userDoc);
  
    if (!docSnapshot.exists()) {
      // If the user does not exist, create a new document in the "users" collection
      await setDoc(userDoc, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user"
      });
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Call a function to save the user in the database
        saveUserToDatabase(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
