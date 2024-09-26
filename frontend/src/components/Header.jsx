import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/">My Expenses</Link>
              </li>
              <li>
                <Link to="/add-expense">Add Expense</Link> {/* Add this link */}
              </li>
              <li>
                <Link to="/statistics">statistics</Link> {/* Add this link */}
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
