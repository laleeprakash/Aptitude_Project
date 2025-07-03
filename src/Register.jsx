import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isValidPassword = (password) => password.length >= 6;

  const handleRegister = async () => {
    setMessage("");

    if (!username || !email || !password) {
      setMessage("All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email!");
      return;
    }

    if (!isValidPassword(password)) {
      setMessage("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registration Successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleRegister}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
  message: {
    marginTop: "10px",
    color: "#333",
    fontWeight: "bold",
  },
};

export default Register;
