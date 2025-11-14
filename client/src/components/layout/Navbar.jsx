import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";


export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Select the auth state (adjust path as per your store)
  const isLoggedIn = useAppSelector((state) => !!state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-slate-800 text-white shadow-md sticky top-0 z-50 border-b-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400">
              ⚖️ AI Judge
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="px-3 py-2 text-base font-semibold hover:text-amber-500 border-b-2 border-transparent hover:border-amber-500">
              Home
            </Link>

            <Link to="/dashboard" className="px-3 py-2 text-base font-semibold hover:text-amber-500 border-b-2 border-transparent hover:border-amber-500">
              My Cases
            </Link>

            <Link to="/create-case" className="px-3 py-2 text-base font-semibold hover:text-amber-500 border-b-2 border-transparent hover:border-amber-500">
              Create Case
            </Link>

            <Link to="/case/join" className="px-3 py-2 text-base font-semibold hover:text-amber-500 border-b-2 border-transparent hover:border-amber-500">
              Join Case
            </Link>

            <Link to="/profile" className="px-3 py-2 text-base font-semibold hover:text-amber-500 border-b-2 border-transparent hover:border-amber-500">
              Profile
            </Link>

            {/* Conditionally Render Logout Button */}
            {isLoggedIn && (
              <button onClick={handleLogout} className="bg-red-700 px-4 py-2 rounded hover:bg-red-800 text-base font-semibold border border-red-600">
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded text-gray-300 hover:text-white hover:bg-slate-700"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-700 border-t border-slate-600">
          <Link to="/landingPage" onClick={toggleMenu} className="block px-3 py-3 text-base font-semibold hover:bg-slate-600 hover:text-amber-500">
            Home
          </Link>

          <Link to="/dashboard" onClick={toggleMenu} className="block px-3 py-3 text-base font-semibold hover:bg-slate-600 hover:text-amber-500">
            My Cases
          </Link>

          <Link to="/create-case" onClick={toggleMenu} className="block px-3 py-3 text-base font-semibold hover:bg-slate-600 hover:text-amber-500">
            Create Case
          </Link>

          <Link to="/case/join" onClick={toggleMenu} className="block px-3 py-3 text-base font-semibold hover:bg-slate-600 hover:text-amber-500">
            Join Case
          </Link>

          <Link to="/profile" onClick={toggleMenu} className="block px-3 py-3 text-base font-semibold hover:bg-slate-600 hover:text-amber-500">
            Profile
          </Link>

          {/* Conditionally Render Mobile Logout Button */}
          {isLoggedIn && (
            <button onClick={handleLogout} className="w-full text-left px-3 py-3 text-base font-semibold bg-red-700 hover:bg-red-800">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
