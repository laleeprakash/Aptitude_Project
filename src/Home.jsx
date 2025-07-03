import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Aptitude Test App </h1>
      <p style={styles.description}>Test your skills and improve your aptitude!</p>

      <div style={styles.buttonContainer}>
        <button style={styles.registerButton} onClick={() => navigate("/register")}>
          Register
        </button>
        <button style={styles.loginButton} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    padding: "20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: "18px",
    color: "#555",
  },
  buttonContainer: {
    marginTop: "30px",
  },
  registerButton: {
    padding: "12px 24px",
    fontSize: "18px",
    margin: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745", 
    color: "#fff",
    fontWeight: "bold",
  },
  loginButton: {
    padding: "12px 24px",
    fontSize: "18px",
    margin: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff", 
    color: "#fff",
    fontWeight: "bold",
  },
};

export default Home;
