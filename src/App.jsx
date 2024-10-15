import { useState } from "react";
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <h1>Bienvenido a mytube</h1>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
