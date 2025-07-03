import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL; // e.g. https://dinewithus-1.onrender.com

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPassword = (pwd) => pwd.length >= 6;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    
    // Client‑side validation
    if (!username || !email || !password) {
      setMessageColor("red");
      return setMessage("All fields are required!");
    }
    if (!isValidEmail(email)) {
      setMessageColor("red");
      return setMessage("Please enter a valid email!");
    }
    if (!isValidPassword(password)) {
      setMessageColor("red");
      return setMessage("Password must be at least 6 characters!");
    }

    setLoading(true);
    try {
      const { data, status } = await axios.post(
        `${API}/signup`,
        { username, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 201) {
        setMessageColor("green");
        setMessage("✅ Registration successful! Redirecting to Login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessageColor("red");
        setMessage(data.error || "Registration failed!");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessageColor("red");
      if (err.response?.status === 400) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Server error! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && (
        <p style={{ ...styles.message, color: messageColor }}>{message}</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    textAlign: "center",
    padding: "1rem",
    border: "1px solid #eee",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
};

export default Register;
