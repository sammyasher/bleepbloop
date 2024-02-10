import React from "react";
import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { navLinks, routes } from "./pages/routes";

const App = () => {
  return (
    <BrowserRouter>
      {navLinks}

      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
};

export default App;
