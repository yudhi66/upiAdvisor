//import { Link } from 'react-router-dom';

import Container from "../components/container.jsx"
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {

    try {
      await fetch(`${import.meta.env.VITE_API_URL}api/v1/users/logout`, {
        method: "GET",
        credentials: "include"
      })

      dispatch(logout());
      navigate("/")

    } catch (error) {
      console.error("logout failed", error);

    }
  }

  const navItems = [
    {
      name: 'Home',

      active: true,
      onClick: () => navigate("/")
    },
    {
      name: 'Login',

      active: !authStatus,
      onClick: () => navigate("/login")
    },
    {
      name: 'Register',

      active: !authStatus,
      onClick: () => navigate("/signup")
    }, {
      name: 'Logout',
      slug: '/',
      active: authStatus,
      onClick: handleLogout
    }, {
      name: "Report",
      active: authStatus,
      onClick: () => navigate("/reporting")
    }, {
      name: "Profile",
      active: authStatus,
      onClick: () => navigate("/profile")
    }

  ];

  return (
    <header className="py-3 shadow ring-slate-50 colo" >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="logo flex items-center space-x-2">
            <img src="src/assets/logo.webp" className="w-[50px] h-[50px]" alt="logo" onClick={() => navigate("/")} />
            <h1 className="text-lg font-semibold" onClick={() => navigate("/")} >UPI Advisor</h1>
          </div>

          {/* Navbar Items */}
          <ul className="flex ml-6 space-x-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={item.onClick}
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
