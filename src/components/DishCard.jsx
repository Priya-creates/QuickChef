import React, { useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

const DishCard = ({
  id,
  img,
  name,
  time,
  favourites,
  setFavourites,
  isFavPage,
}) => {
  const [isFilled, setIsFilled] = useState(false);

  function handleAddToFavorite(id, name, img, time) {
    let favourites = JSON.parse(localStorage.getItem("favourites"));
    if (!isFilled && !isPresent(id)) {
      setIsFilled(true);

      favourites = [
        ...favourites,
        { id: id, name: name, img: img, time: time },
      ];
      console.log("ADD: ", favourites);
    } else {
      setIsFilled(false);
      favourites = favourites.filter((item) => item.id !== id);
      console.log("REMOVE: ", favourites);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    setFavourites(favourites);
  }

  function isPresent(idd) {
    console.log("favv", favourites);
    return favourites && favourites.some((item) => item.id === idd);
  }

  return (
    <div className="flex flex-col bg-pink-100 py-3 px-3 rounded-sm">
      <div className="w-full  object-cover">
        <img src={img} alt="meal-img" className="rounded shadow-md" />
      </div>
      <div className="flex justify-center items-center mt-5 gap-3 ">
        <div className="p-1 px-3 text-[15px] text-center font-semibold bg-pink-100 text-pink-700 rounded-md  ">
          {name}
        </div>
        <div
          onClick={
            !isFavPage
              ? () => handleAddToFavorite(id, name, img, time)
              : undefined
          }
          className={`flex justify-center items-center  ${
            isFilled ? "animate-heart" : ""
          } `}
        >
          {isPresent(id) || isFavPage ? (
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

export default DishCard;
