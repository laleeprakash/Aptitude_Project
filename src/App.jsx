import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Test from "./componects/Test";
import CategorySelection from "./CategorySelection";
import SubcategorySelection from "./componects/SubcategorySelection";
import Questions from "./componects/Questions";
import Navbar from "./Navbar";
import Home from "./Home";
import SubmitTest from "./componects/SubmitTest";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const authHandler = (status) => {
    setIsAuthenticated(status);
    if (!status) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  };

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} authHandler={authHandler} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register authHandler={authHandler} />} />
        <Route path="/login" element={<Login authHandler={authHandler} />} />
        <Route path="/category" element={<CategorySelection />} />
        <Route path="/subcategory/:categoryId" element={<SubcategorySelection />} />
        <Route path="/questions/:subcategoryId" element={<Questions />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/test/:categoryId" element={isAuthenticated ? <Test /> : <Navigate to="/login" />} />
        <Route path="/submit-test" element={<SubmitTest />} />
      </Routes>
    </>
  );
}

export default App;
