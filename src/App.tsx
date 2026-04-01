import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AdventureDetailPage from "./pages/AdventureDetailPage";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SavesPage from "./pages/SavesPage";
import FavoritesPage from "./pages/FavoritesPage";
import EditorPage from "./pages/author/EditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Editor has its own layout (full screen) */}
        <Route path="/editor/:adventureId?" element={
          <ProtectedRoute><EditorPage /></ProtectedRoute>
        } />

        {/* Game has its own layout */}
        <Route path="/play/:adventureId" element={
          <ProtectedRoute><GamePage /></ProtectedRoute>
        } />

        {/* Standard pages with navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/adventure/:id" element={<AdventureDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/saves" element={
            <ProtectedRoute><SavesPage /></ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute><FavoritesPage /></ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}