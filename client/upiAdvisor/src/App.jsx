/* eslint-disable no-unused-vars */
 
import { Outlet } from 'react-router-dom';
 import Header from './pages/header.jsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {login,logout} from "./store/authSlice.js"
function App() {
  const [loading,setLoading]=useState(true);
  const dispatch =useDispatch();
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/users/getUser", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        return response.json();
      })
      .then(({ data }) => {

   
        if (data) {
    
          dispatch(login({ userData: data }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
   
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);


  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-[#222831] text-white'>
    <div className='w-full block'>
         <Header/>
        <main>

        <Outlet/>
        </main>

        
      
    </div>
 
    
    </div>

     
  ):null
}

export default App
