import { createContext, useState } from "react";

export const FavoritesContext = createContext({
  ids: [],
  addFavorite: (id) => {},
  removeFavorite: (id) => {},
});

function FavouritesContextProvider({ children }) {
  const [favoriteMealIds, setFavoriteMealIds] = useState([]);

  function addFavourite(id) {
    setFavoriteMealIds((currentIds) => [...currentIds, id]);
  }

  function removeFavourite(id) {
    setFavoriteMealIds((currentIds) =>
      currentIds.filter((mealId) => mealId !== id)
    );
  }

  const value = {
    ids: favoriteMealIds,
    addFavorite: addFavourite,
    removeFavorite: removeFavourite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavouritesContextProvider;
