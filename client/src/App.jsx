import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MatchDetails from "./pages/MatchDetails";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <h1>App.jsx</h1>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/match/:matchId" element={<MatchDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;