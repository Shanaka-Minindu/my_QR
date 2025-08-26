import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from "../store/user_auth_context";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const userLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/adminlogout", {
        method: "POST",
        credentials: "include",

        headers: { "Content-Type": "application/json" },
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
    } catch (err) {
      console.error("Error posting data:", err);
      throw err;
    }
    
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-gray-200">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-bold whitespace-nowrap">
            Simple QR
          </span>
        </Link>

        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2"
                onClick={() => {
                  navigate("/adminuser");
                }}
              >
                <span className="hidden text-sm font-medium text-gray-900 md:block">
                  {user.uName}
                </span>
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-300"
                  id="user-menu-button"
                  aria-expanded="false"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      user.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/260/260253.png"
                    }
                    alt="User profile"
                  />
                </button>
              </div>
              <button
                onClick={userLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Login
            </NavLink>
          )}

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-cta"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-cta"
        >
          <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <NavItem to="/adminqrdata">QR Data Management</NavItem>
            <NavItem to="/adminuserinfo">Users Info</NavItem>
            <NavItem to="/adminpaylog">Payment Log</NavItem>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block py-2 px-3 md:p-0 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 ${
            isActive
              ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:font-bold"
              : "text-gray-900"
          }`
        }
        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
      >
        {children}
      </NavLink>
    </li>
  );
};

export default AdminNavbar;
