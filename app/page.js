'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import CustomCard from './components/Card'; // Import your custom card component
import { UserAuth } from "./context/AuthContext";
const Home = () => {
  const [projects, setProjects] = useState([]);
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(db, 'cauze');
        const querySnapshot = await getDocs(projectsCollection);

        const projectsData = [];
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() });
        });

        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };

    fetchProjects();
  }, []);

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
    <div className='min-h-screen bg-gray-100'>
      {loading ? (
        false
      ) :user ? (
        <div className='p-10  w-full' >
          <h2 className="text-2xl text-gray-700 font-semibold mb-6">Toate Proiectele</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <CustomCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Bine ai venit pe <span className="text-blue-600">Altă șansă</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Suntem o platformă dedicată susținerii asociațiilor și organizațiilor caritabile care doresc să facă o schimbare pozitivă în comunitatea noastră.
          </p>
          <p className="text-lg text-gray-600 mb-8 text-center">
            La <span className="text-blue-600">Altă șansă</span>, credem în puterea oamenilor de a face diferențe semnificative prin generozitatea lor.
          </p>
         
        </div>
      </div>
      )}
    </div>
  );
};

export default Home;
