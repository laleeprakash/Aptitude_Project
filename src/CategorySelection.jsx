import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategorySelection = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/categories/")
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/get_subcategory?categoryId=${selectedCategory.id}`)
        .then((response) => {
          setSubcategories(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching subcategories:", err);
          setError("Failed to load topics.");
          setLoading(false);
        });
    }
  }, [selectedCategory]);

  // Handle category click
  const handleCategoryClick = (category) => {
    setError("");
    setSelectedCategory(category);
    navigate(`/test/${category.id}`);
  };

  // Handle topic selection
  const handleTopicSelect = (topicName) => {
    if (!topicName || !selectedCategory) {
      alert("Please select a valid topic!");
      return;
    }
   
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Select a Category</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!selectedCategory ? (
        <div style={styles.buttonContainer}>
          {categories.slice(0, 4).map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              style={styles.button}
              aria-label={`Select category ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={styles.subCategoryContainer}>
          <h3>Topics in "{selectedCategory.name}"</h3>

          <div style={styles.buttonContainer}>
            {subcategories.length > 0 ? (
              subcategories.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.name)}
                  style={styles.button}
                  aria-label={`Select topic ${topic.name}`}
                >
                  {topic.name}
                </button>
              ))
            ) : (
              <p>No topics found for this category.</p>
            )}
          </div>

          <button
            onClick={() => setSelectedCategory(null)}
            style={{ ...styles.button, backgroundColor: "#6c757d", marginTop: "15px" }}
            aria-label="Go back to category selection"
          >
            Back to Categories
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "15px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  subCategoryContainer: {
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
  },
};

export default CategorySelection;
