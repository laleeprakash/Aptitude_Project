import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://aptitude-project.onrender.com/signin", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      if (response.data.token) {
        // Save token and userId from response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id); // Fix: Save userId correctly

        setMessageColor("green");
        setMessage("Login Successful!");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/category");
        }, 1000);
      } else {
        setMessageColor("red");
        setMessage("Login Failed! Invalid credentials.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setMessageColor("red");

      if (error.response?.status === 400) {
        setMessage("Incorrect email or password!");
      } else {
        setMessage("Unable to connect to the server. Try again later.");
      }
    }

    setLoading(false);
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
      {message && <p style={{ ...styles.message, color: messageColor }}>{message}</p>}
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
