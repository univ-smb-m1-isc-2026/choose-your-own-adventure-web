import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/author/EditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/" element={<div className="p-8 text-gray-600">Accueil — bientôt disponible</div>} />
      </Routes>
    </BrowserRouter>
  );
}