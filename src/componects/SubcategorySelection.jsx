
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SubcategorySelection = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/subcategories/")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((cat) => cat.id === parseInt(categoryId))
          .flatMap((cat) => cat.subcategories || []);
        setSubcategories(filtered);
      });
  }, [categoryId]);

  const handleClick = (subcategoryId) => {
    navigate(`/questions/${subcategoryId}`);
  };

  return (
    <div style={styles.container}>
      <h2>Select a Subcategory</h2>
      <div style={styles.buttonContainer}>
        {subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleClick(sub.id)}
            style={styles.button}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SubcategorySelection;
