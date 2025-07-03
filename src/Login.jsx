import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL; // e.g. https://your-backend.onrender.com

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // On mount, attach token if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API}/signin`, {
        email,
        password,
      });

      console.log("Login response:", data.user);

      if (data.token && data.user?.id) {
        // Save token and userId
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);

        // Attach for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        setMessageColor("green");
        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/category");
        }, 500);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessageColor("red");
      if (err.response?.status === 400) {
        setMessage("Incorrect email or password!");
      } else {
        setMessage("Unable to connect to server. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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
    textAlign: "center",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    width: "270px",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default Login;
