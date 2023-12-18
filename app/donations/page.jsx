'use client'
import React, {useEffect,useState} from 'react'
import { UserAuth } from '../context/AuthContext'

const page = () => {
    const {user} = UserAuth()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve,300))
            setLoading(false)
        }
        checkAuthentication()
      },[user])

  return (
    
    <div className='p-4'>
        {loading ? false : user ? (
        <p>Donatii {user.uid}</p>
    ) : (
        <p>Trebuie sa fi autentificat pentru a vedea aceasta pagina.</p>
    )}
    </div>
  )
}

export default page