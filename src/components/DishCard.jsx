import React from "react";

const DishCard = (props) => {
  return (
    <div className="flex flex-col">
      <div className="w-full md:w-[210px] lg:w-[250px] object-cover">
        <img src={props.img} alt="meal-img" className="rounded shadow-md" />
      </div>
      <div className="text-[15px] text-center mt-4 font-semibold bg-pink-200 text-pink-700 rounded-md py-1 px-3 inline-block mx-auto">
        {props.name}
      </div>
      <div className="text-center text-[14px] mt-2 text-pink-700">Time Required: {props.time} minutes</div>
    </div>
  );
};

export default DishCard;
