import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <FavouritesProvider>
        <App />
      </FavouritesProvider>
    </BrowserRouter>
 
);
