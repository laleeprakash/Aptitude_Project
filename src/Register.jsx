import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL; // e.g. https://your-backend.com

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic client-side validation
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
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessageColor("green");
        setMessage("✅ Registration successful! Redirecting to Login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessageColor("red");
        setMessage(data.error || "Registration failed!");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setMessageColor("red");
      setMessage("Server error! Please try again later.");
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
        {message && (
          <p style={{ ...styles.message, color: messageColor }}>{message}</p>
        )}
      </form>
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
    width: "100%",
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
    fontWeight: "bold",
  },
};

export default Register;
