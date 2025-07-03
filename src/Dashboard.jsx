import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem("userId"); // Fix: Get userId from localStorage

      if (!userId) {
        alert("User not logged in! Redirecting...");
        navigate("/login"); // Redirect to login if user is not logged in
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/dashboard/${userId}`);
        setProfile(response.data.profile);
        setScores(response.data.scores);
        setFeedback(response.data.feedback);
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData(); // Call the fetch function on component mount
  }, [navigate]); // Re-run if navigate changes

  if (loading) return <p>⏳ Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div style={styles.container}>
      <h2>📊 Dashboard</h2>
      {profile && (
        <div style={styles.profileCard}>
          <p>👤 <strong>Username:</strong> {profile.username}</p>
          <p>📧 <strong>Email:</strong> {profile.email}</p>
        </div>
      )}

      <h3>📌 Score History</h3>
      {scores.length > 0 ? (
        <ul style={styles.scoreList}>
          {scores.map((score, index) => (
            <li key={index} style={styles.scoreItem}>
              {score.category.name}: <strong>{score.score}/{score.total_questions}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>⚠️ No test scores yet.</p>
      )}

      <h3>💡 Latest Feedback</h3>
      <p style={styles.feedback}>{feedback || "📭 No feedback yet."}</p>
    </div>
  );
};

// ✅ Styling for better UI
const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f8f9fa",
  },
  profileCard: {
    padding: "15px",
    borderRadius: "5px",
    backgroundColor: "#e9ecef",
    marginBottom: "15px",
  },
  scoreList: {
    padding: 0,
    listStyle: "none",
  },
  scoreItem: {
    backgroundColor: "#ffffff",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "5px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  feedback: {
    fontStyle: "italic",
    backgroundColor: "#fffae6",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default Dashboard;
