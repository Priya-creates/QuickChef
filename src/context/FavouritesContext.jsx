import React, { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);

  //setting the favourites at starting
  useEffect(() => {
    if (localStorage.getItem("favourites")) {
      let favouritesList = JSON.parse(localStorage.getItem("favourites"));
      setFavourites(favouritesList);
    } else {
      localStorage.setItem("favourites", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return(
    <FavouritesContext.Provider value={{favourites, setFavourites}}>
      {children}
    </FavouritesContext.Provider>
  )
};
