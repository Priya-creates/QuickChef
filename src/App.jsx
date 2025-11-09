import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Favourites from "./components/Favourites";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favourites" element={<Favourites />} />
    </Routes>
  );
};

export default App;
