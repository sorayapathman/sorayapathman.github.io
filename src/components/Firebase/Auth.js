// https://github.com/nikaocreatives/react-firebase-auth-email-link/blob/master/src/Auth.js
import React, { useEffect, useState } from "react";
import firebaseApp from "./firebase";
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export const AuthContext = React.createContext();

const auth = getAuth();

const fetchUserData = (user,setUserData) => {
  const dbRef = ref(getDatabase());

  const userId = user.uid
  const path = `users/${userId}`;

  get(child(dbRef, path)).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();

      setUserData(userData)
    } else {
      console.log("No data available for this person!!");
    }
  }).catch((error) => {
    console.error(error);
  });
}


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getAuth().onAuthStateChanged(function(theUser) {
      if (theUser) {
        // User is signed in.
        setCurrentUser(theUser)
        fetchUserData(theUser, setUserData)
      } else {
        // User is not signed in.
        setCurrentUser(null)
      }
    });
  }, []);

  const fetchTheUserData = (user) => {
    return fetchUserData(user, setUserData)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        fetchUserData: fetchTheUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};