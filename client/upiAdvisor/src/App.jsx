/* eslint-disable no-unused-vars */
 
import { Outlet } from 'react-router-dom';
 import Header from './pages/header.jsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
function App() {
  const [loading,setLoading]=useState(true);
  const dispatch =useDispatch();
 useEffect(()=>{

  
 })


  return (
    <div className='min-h-screen flex flex-wrap content-between bg-[#222831] text-white'>
    <div className='w-full block'>
         <Header/>
        <main>

        <Outlet/>
        </main>

        
      
    </div>
 
    
    </div>

     
  )
}

export default App
