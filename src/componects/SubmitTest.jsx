import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubmitTest = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    // If the user refreshes the page or navigates directly
    return (
      <div style={styles.container}>
        <h2>No Results Found</h2>
        <p>Please take a test to see your results.</p>
        <button onClick={() => navigate("/")} style={styles.button}>
          Go to Home
        </button>
      </div>
    );
  }

  const { score, feedback } = state;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Test Result</h2>
      <p style={styles.result}><strong>Score:</strong> {score}</p>
      <p style={styles.result}><strong>Feedback:</strong> {feedback}</p>
      <button onClick={() => navigate("/")} style={styles.button}>
        Go to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "1rem",
    color: "#333",
  },
  result: {
    fontSize: "18px",
    marginBottom: "0.8rem",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SubmitTest;
