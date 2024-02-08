import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { SmokeySparkler } from "./pages/SmokeySparkler";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smokeysparkler" element={<SmokeySparkler />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
