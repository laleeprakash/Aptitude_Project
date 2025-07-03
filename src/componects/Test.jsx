import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Test = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) return;

    axios
      .get(`http://localhost:3000/get_subcategory`, {
        params: { categoryId },
      })
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setCategories([{ name: "", subcategories: data }]);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching subcategories:", err);
      });
  }, [categoryId]);

  const handleStartTest = () => {
    if (selectedSubcategoryId) {
      navigate(`/questions/${selectedSubcategoryId}`);
    } else {
      alert("Please select a subcategory to start the test.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Select a Subcategory</h2>
      {categories.length > 0 ? (
        <div style={styles.dropdownContainer}>
          <select
            style={styles.select}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            value={selectedSubcategoryId}
          >
            <option value="">-- Select Subcategory --</option>
            {categories.map((cat) =>
              cat.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))
            )}
          </select>
          <button onClick={handleStartTest} style={styles.button}>
            Start Test
          </button>
        </div>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  dropdownContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Test;
