import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = async () => {
    const usersCollection = collection(db, "users");
    const userDoc = doc(usersCollection, user.uid);

    try {
      const docSnapshot = await getDoc(userDoc);

      if (docSnapshot.exists()) {
        // Document exists, you can access the data
        const userData = docSnapshot.data();
        console.log(userData.role);
        return userData.role;
      } else {
        // Document doesn't exist

        return null;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
  
      if (user) {
        try {
          const result = await isAdmin();
          setRole(result);
        } catch (error) {
          console.error("Error checking admin status:", error.message);
        }
      }
  
      setLoading(false);
    };
  
    checkAuthentication();
  }, [user]);
  

  return (
    <div className="h-20 bg-gray-900 flex items-center justify-between p-2">
      <ul className="flex justify-between w-full">
        <li className="p-2 cursor-pointer">
          <Link href="/">Altă șansă</Link>
        </li>

        {/* {!user ? null : (
          <li className="p-2 cursor-pointer">
            <Link href="/donations">Donatii</Link>
          </li>
        )} */}

        {!user ? null : role === 'admin' ? (
            
          <li className="p-2  cursor-pointer">
            <Link href="/addCauza">Adauga cauza</Link>
          </li>
        ) : null}
      </ul>
      {loading ? (
        false
      ) : !user ? (
        <ul className="flex">
          <li onClick={handleSignIn} className="p-2 cursor-pointer">
            Login
          </li>
          
        </ul>
      ) : (
        <div className="ml-5 w-15 text-center">
          <p>Salut, {user.displayName}</p>
          <p className="cursor-pointer" onClick={handleSignOut}>
            Sign out
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
