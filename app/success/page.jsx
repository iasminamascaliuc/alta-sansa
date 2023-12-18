'use client'
import React, {useEffect,useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useSearchParams  } from 'next/navigation';
import { collection, doc, updateDoc,getDocs} from "firebase/firestore";
import { db } from "../firebase";
const page = () => {
    const {user} = UserAuth()
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    // Extract the query parameters from the URL
    
    const cauzaId = searchParams.get("cauzaId");
    const userName = searchParams.get("userName");
    const price = searchParams.get("price");

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve,500))
            setLoading(false)
            try {
                if (user) {
                    const projectsCollection = collection(db, 'cauze');
                    const querySnapshot = await getDocs(projectsCollection,cauzaId);
                    
                    let currentCauza = {};
                    querySnapshot.forEach((doc) => {
                        if (doc.id === cauzaId){

                            currentCauza = { id: doc.id, ...doc.data() }
                            }
                        
                    });
                    console.log(currentCauza);
                    const updatedContributors = currentCauza.contribuitors

                    if (!updatedContributors.includes(userName)) {
                        updatedContributors.push(userName);
                      }

                    await updateDoc(doc(db, "cauze", cauzaId), {
                        currentDonation: parseInt(currentCauza.currentDonation )+parseInt( price),
                        contribuitors : updatedContributors
                      
                    });
                }
                await new Promise((resolve) => setTimeout(resolve,1500))
                window.location.href = '/'
                
            } catch (error) {
                
            }
        }
        checkAuthentication()
        
      },[user])

  return (
    
    <div className='flex items-center justify-center p-4 min-h-screen bg-gray-100 text-4xl font-bold text-gray-800 text-center'>
        {loading ? false : user ? (
        <p>Ai donat cu succes!</p>
    ) : (
        <p>Trebuie sa fi autentificat pentru a vedea aceasta pagina.</p>
    )}
    </div>
  )
}

export default page