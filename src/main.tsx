import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Review from "./pages/Review";

import "./styles/theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/results/:id" element={<Results />} />
         <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);