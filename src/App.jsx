// src/App.jsx
import "./App.css";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubscriptionsTable from "./components/SubscriptionsTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/subscriptions" element={<SubscriptionsTable />} />
      </Routes>
    </Router>
  );
}

export default App;
