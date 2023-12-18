"use strict";
const { FirebaseApp } = require("firebase/app");
import { auth, db,functions } from "./firebase";
import { collection, addDoc,onSnapshot,getDoc,doc} from "firebase/firestore";
const {  httpsCallable } = require("firebase/functions");

export const getCheckoutUrl = async ( priceId, cauzaId,price) => {
  const userId = auth.currentUser?.uid;
  const userName = auth.currentUser?.displayName;
  if (!userId) throw new Error("User is not authenticated");

  
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );
  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: `${window.location.origin}/success?cauzaId=${cauzaId}&userName=${userName}&price=${price}`,
    cancel_url: window.location.origin,
  });

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data();
      if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        console.log("Stripe Checkout URL:", url);
        unsubscribe();
        resolve(url);
      }
    });
  });
};

export const getPortalUrl = async () => {

  const user = auth.currentUser;

  let dataWithUrl;
  try {
    
    const functionRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );
    const { data } = await functionRef({
      customerId: user?.uid,
      returnUrl: window.location.origin,
    });

    // Add a type to the data
    dataWithUrl = data;
    console.log("Reroute to Stripe portal: ", dataWithUrl.url);
  } catch (error) {
    console.error(error);
  }

  return new Promise((resolve, reject) => {
    if (dataWithUrl.url) {
      resolve(dataWithUrl.url);
    } else {
      reject(new Error("No url returned"));
    }
  });
};
