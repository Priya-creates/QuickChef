import React, { useContext, useState } from "react";
import { IoIosHeart } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import DishCard from "./DishCard.jsx";
import { Link } from "react-router-dom";
import { FavouritesContext } from "../context/FavouritesContext.jsx";

const Favourites = () => {
  const [isFavPage, setIsFavPage] = useState(true);
  const { favourites } = useContext(FavouritesContext);

  return (
    <div className="px-6">
      <div className="text-4xl mt-7 text-center text-pink-300 font-bold flex justify-center items-center gap-3 mb-10 ">
        Your <span className=" font-bold text-pink-700">Loved</span> Picks{" "}
        <IoIosHeart size={32} className="text-pink-700 inline" />
      </div>
      <Link to="/">
        <div className="text-pink-700 mb-5 ">
          <button className="flex gap-2 items-center p-2 px-4 rounded-md bg-pink-100 font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:bg-pink-200 ">
            <RiArrowGoBackFill />
            <div>Go back</div>
          </button>
        </div>
      </Link>
      {favourites.length === 0 && (
        <div className="text-center text-gray-600  mt-[200px] ">
          <div>No Favourites Added</div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 sm:gap-4 md:gap-5  place-items-center  mx-auto mb-10 ">
        {favourites.length > 0 &&
          favourites.map((item) => (
            <div key={item.id}>
              <DishCard
                id={item.id}
                name={item.name}
                time={item.time}
                img={item.img}
                isFavPage={isFavPage}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Favourites;
