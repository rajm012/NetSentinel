// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import DocsPage from "./views/DocsPage";
import LoginPage from "./views/LoginPage"
import DashboardLayout from "./components/layouts/DashboardLayout";;
import "./index.css";


function App() {
  return (
    <Router>
      <Routes>
      {/* -----------------------Home page routes------------------------------------ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/login" element={<LoginPage />} />

      {/* -----------------------dashboard routes------------------------------------ */}
      <Route path="/dashboard" element={<DashboardLayout />}>
      </Route>

      </Routes>
    </Router>
  );
}

export default App;
