import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { SmokeySparkler } from "./pages/SmokeySparkler";
import { SmokeySparkler_cone } from "./pages/SmokeySparkler_cone";
import { NoteMaker } from "./pages/NoteMaker";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smokeysparkler" element={<SmokeySparkler />} />
        <Route path="/smokeysparkler_cone" element={<SmokeySparkler_cone />} />
        <Route path="/notemaker" element={<NoteMaker />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
