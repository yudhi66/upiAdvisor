 
import { Outlet } from 'react-router-dom';
 import Header from './pages/header.jsx';
function App() {
 

  return (
    <>
      <Header/>

<main>
    <Outlet/>
</main>  


    </>
  )
}

export default App
