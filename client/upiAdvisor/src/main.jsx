import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
 import SignUp from "./pages/signUp.jsx"
 import Profile from './pages/profile.jsx'
 import ForgotPassword from './pages/forgotPassword.jsx'
 import ResetPassword from './pages/resetPassword.jsx'
 import Report from './pages/reporting.jsx'
 import Results from './pages/results.jsx'
import { Provider } from 'react-redux'

import store from './store/store.js'

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

    },{
      path:"/forgot",
      element:<ForgotPassword/>
    },{
      path:"/reset",
      element:<ResetPassword/>
    },{
      path:"/reporting",
      element:<Report/>
    },{
      path:"/report",
      element:<Results/>
    }
  ]






  }  

])





createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
   
  </StrictMode>,
)
