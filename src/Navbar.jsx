import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Aptitude Test App</h2>
      <ul style={styles.navLinks}>
        {!isAuthenticated ? (
          <>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            <li><Link to="/register" style={styles.link}>Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
            
            <li>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "15px 20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    color: "#fff",
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
  logoutBtn: {
    backgroundColor: "#dc3545", // Red color for logout
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
};

export default Navbar;
