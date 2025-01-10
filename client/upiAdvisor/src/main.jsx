import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
 import SignUp from "./pages/signUp.jsx"
 import Profile from './pages/profile.jsx'
const router=createBrowserRouter([
  {
  path:"/",
  element:<App/>,
  children:[
    {
      path:"/",
      element:<Home/>

    },{
      path:"/login",
      element:<Login/>
    },{
      path:"/signup",
      element:<SignUp/>
     

    },{
      path:"/profile",
      element:<Profile/>

    }
  ]






  }  

])





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
