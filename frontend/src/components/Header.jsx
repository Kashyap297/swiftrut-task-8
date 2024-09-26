import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-gray-300">
            Expense Tracker
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          {user ? (
            <>
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-gray-300 transition duration-300"
                >
                  My Expenses
                </Link>
              </li>
              <li>
                <Link
                  to="/add-expense"
                  className="text-white hover:text-gray-300 transition duration-300"
                >
                  Add Expense
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="text-white hover:text-gray-300 transition duration-300"
                >
                  Statistics
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-300 transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white hover:text-gray-300 transition duration-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
