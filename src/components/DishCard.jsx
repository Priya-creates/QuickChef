import React from "react";

const DishCard = (props) => {
  return (
    <div>
      <div className="w-full md:w-[210px] lg:w-[250px]">
        <img src={props.img} alt="meal-img" className="rounded" />
      </div>
      <div className="text-[17px] text-center mt-2 font-semibold">
        {props.name}
      </div>
      <div className="text-center text-[15px] mt-2">Time Required: {props.time} minutes</div>
    </div>
  );
};

export default DishCard;
