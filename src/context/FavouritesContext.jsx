import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  //setting the favourites at starting
  useEffect(() => {
  const stored = localStorage.getItem("favourites");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setFavourites(parsed);
    } catch {
      console.error("Invalid favourites data in localStorage");
    }
  }
}, []); // ✅ Runs only once — never loops

useEffect(() => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}, [favourites]); // ✅ Runs only when favourites changes


  return(
    <FavouritesContext.Provider value={{favourites, setFavourites}}>
      {children}
    </FavouritesContext.Provider>
  )
};
