"use client";
import React, {useEffect, useState } from "react";
import { collection,doc, addDoc,getDoc } from 'firebase/firestore';
import { UserAuth } from '../context/AuthContext'
import { db } from '../firebase'; // Import your Firebase initialization file



const page = () => {
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
    goal: 0,
    amount: 0,
    contribuitors: [],
    currentDonation:0,
    priceId: ""
  });

  const {user} = UserAuth()
  const [loading, setLoading] = useState(true)

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
        await new Promise((resolve) => setTimeout(resolve,500))
        setLoading(false)
        if(!user){
            window.location.href = '/'
        }else {
            const result = await isAdmin()
            if(result == "user"){
                window.location.href = '/'
            }
        }
    }
    checkAuthentication()
    
  },[user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNaN(formData.goal)) {
        console.error('Invalid goal value. Please enter a valid number.');
        // Optionally, you can show an error message to the user or handle it in your UI
        return;
      }
  
    try {
      // Save form data to Firestore
      const projectsCollection = collection(db, 'cauze');
      await addDoc(projectsCollection, formData);
  
      console.log('Form submitted and data saved to Firestore:', formData);
      window.location.href = '/'
      // Add any additional logic or redirect the user after submission
    } catch (error) {
      console.error('Error saving data to Firestore:', error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

{loading ? false : user ? (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center">
        <h2 className="block text-gray-700 text-2xl font-semibold mb-6">
          Adauga o cauza
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nume proiect
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Photo URL
          </label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Descriere proiect
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="goal"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Funding Goal
          </label>
          <input
            type="text"
            id="goal"
            name="goal"
            value={parseInt(formData.goal)}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Suma donatie
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={parseInt(formData.amount)}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="priceId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Stripe ID
          </label>
          <input
            type="text"
            id="priceId"
            name="priceId"
            value={formData.priceId}
            onChange={handleChange}
            className="w-full text-gray-700 border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Adauga
          </button>
        </div>
      </form>
    </div>)
    : (
        <p className="">Trebuie sa fi autentificat pentru a vedea aceasta pagina.</p>
    )}
    </div>
  );
};

export default page;
