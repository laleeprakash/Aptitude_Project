import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Questions = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    axios
      .get(`http://localhost:3000/get_questions/${subcategoryId}`)
      .then((response) => {
        if (isMounted) {
          setQuestions(response.data || []);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [subcategoryId]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("You must be logged in to submit the test.");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOption]) => ({
        question_id: parseInt(questionId),
        selected_option: selectedOption,
      })
    );

    if (formattedAnswers.length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      user_id: parseInt(userId),
      subcategory_id: parseInt(subcategoryId),
      answers: formattedAnswers,
    };

    setSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/submit-test", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;

      navigate("/submit-test", {
        state: {
          score: result.score,
          feedback: result.feedback,
        },
      });
    } catch (error) {
      console.error("Error submitting test:", error);

      const result = error?.response?.data;
      let errorMessage = "An unexpected error occurred.";

      if (result && typeof result === "object") {
        if (result.detail) {
          errorMessage = result.detail;
        } else {
          errorMessage = Object.entries(result)
            .map(([key, val]) => `${key}: ${val}`)
            .join("\n");
        }
      }

      alert(`Submission Failed:\n${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderOptions = (q) => {
    const options = {
      a: q.option_a,
      b: q.option_b,
      c: q.option_c,
      d: q.option_d,
    };

    return Object.entries(options).map(([key, text]) => (
      <label key={key} style={styles.optionLabel}>
        <input
          type="radio"
          name={`question-${q.id}`}
          value={key}
          checked={answers[q.id] === key}
          onChange={() => handleOptionChange(q.id, key)}
        />
        {key}) {text}
      </label>
    ));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Questions</h2>

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        <ul style={styles.questionList}>
          {questions.map((q) => (
            <li key={q.id} style={styles.questionItem}>
              <p style={styles.questionText}>{q.question_text}</p>
              {renderOptions(q)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available for this subcategory.</p>
      )}

      {questions.length > 0 && (
        <button
          onClick={handleSubmit}
          style={styles.submitButton}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "left",
    maxWidth: "700px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
  },
  questionList: {
    listStyleType: "none",
    padding: 0,
  },
  questionItem: {
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  questionText: {
    fontWeight: "bold",
  },
  optionLabel: {
    display: "block",
    marginBottom: "8px",
    cursor: "pointer",
  },
  submitButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default Questions;
