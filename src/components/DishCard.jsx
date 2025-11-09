import React, { useContext, useState, useMemo } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FavouritesContext } from "../context/FavouritesContext";

const DishCard = ({ id, img, name, time, isFavPage }) => {
  const [isFilled, setIsFilled] = useState(false);
  const { favourites, setFavourites } = useContext(FavouritesContext);

  // ✅ Memoize so it doesn’t re-run unnecessarily
  const isFav = useMemo(() => {
    return favourites && favourites.some((item) => item.id === id);
  }, [favourites, id]);

  function handleAddToFavorite() {
    if (!isFilled && !isFav) {
      setIsFilled(true);
      const updated = [...favourites, { id, name, img, time }];
      setFavourites(updated);
    } else {
      setIsFilled(false);
      const updated = favourites.filter((item) => item.id !== id);
      setFavourites(updated);
    }
  }

  return (
    <div className="flex flex-col bg-pink-100 py-3 px-3 rounded-sm">
      <div className="w-full object-cover">
        <img src={img} alt="meal-img" className="rounded shadow-md" />
      </div>
      <div className="flex justify-center items-center mt-5 gap-3 ">
        <div className="p-1 px-3 text-[15px] text-center font-semibold bg-pink-100 text-pink-700 rounded-md">
          {name}
        </div>
        <div
          onClick={!isFavPage ? handleAddToFavorite : undefined}
          className={`flex justify-center items-center ${
            isFilled ? "animate-heart" : ""
          }`}
        >
          {isFav || isFavPage ? (
            <IoMdHeart size={20} className="text-pink-700" />
          ) : (
            <IoMdHeartEmpty size={20} className="text-pink-700" />
          )}
        </div>
      </div>
      <div className="text-center text-[14px] mt-2 text-pink-700">
        Time Required: {time} minutes
      </div>
    </div>
  );
};

export default React.memo(DishCard);
