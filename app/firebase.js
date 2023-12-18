// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"
import { getFunctions} from "firebase/functions"
import { getStripePayments } from "@invertase/firestore-stripe-payments";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzJhT97aGUAkeGoS4NCaTBgZwf7Cm42qU",
  authDomain: "ultima-sansa.firebaseapp.com",
  projectId: "ultima-sansa",
  storageBucket: "ultima-sansa.appspot.com",
  messagingSenderId: "918819181321",
  appId: "1:918819181321:web:d90075472385d72bd839d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});
const functions = getFunctions(app, "us-central1");
export {auth, db,payments,functions}