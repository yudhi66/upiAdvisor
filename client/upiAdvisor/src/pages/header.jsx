//import { Link } from 'react-router-dom';
 
 import Container from "../components/container.jsx"
import { useNavigate } from 'react-router-dom';
 

function Header() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'Login',
      slug: '/login',
      active: true,
    },
    {
      name: 'Register',
      slug: '/signup',
      active: true,
    },
   
  ];

  return (
    <header className="py-3 shadow ring-slate-50 colo" >
    <Container>
      <nav className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="logo flex items-center space-x-2">
          <img src="src/assets/logo.webp" className="w-[50px] h-[50px]" alt="logo" onClick={()=>navigate("/")}/>
          <h1 className="text-lg font-semibold" onClick={()=>navigate("/")} >UPI Advisor</h1>
        </div>
        
        {/* Navbar Items */}
        <ul className="flex ml-6 space-x-4">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="inline-block px-4 py-2 duration-200 hover:bg-blue-100 hover:text-black rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}
        </ul>
      </nav>
    </Container>
  </header>
  );
}

export default Header;
