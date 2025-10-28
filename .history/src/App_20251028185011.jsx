import React from "react";
import axios from "axios";
import { IoIosArrowDropdown } from "react-icons/io";
import DishCard from "./components/DishCard";
import Title from "./components/Title";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { duration } from "./assets/duration";
import { RiResetLeftFill } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

const App = () => {
  const [ingredient, setIngredient] = React.useState("");
  const [ingredientResults, setIngredientResults] = React.useState({});
  const [lockedNoMatch, setLockedNoMatch] = React.useState(false);
  const [dishes, setDishes] = React.useState([]);
  const [ingredientList, setIngredientList] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showChooseTime, setShowChooseTime] = React.useState(false);
  const [dishesWithTime, setDishesWithTime] = React.useState([]);
  const [ingreListWithNoDishes, setIngreListWithNoDishes] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [time, setTime] = React.useState({
    under_15: false,
    under_30: false,
    under_60: false,
    over_60: false,
  });

  const [category, setCategory] = React.useState({
    under_15: [],
    under_30: [],
    under_60: [],
    over_60: [],
  });

  // Categorize meals by duration
  React.useEffect(() => {
    const newCategories = {
      under_15: [],
      under_30: [],
      under_60: [],
      over_60: [],
    };
    for (const id in duration) {
      const mins = duration[id];
      if (mins <= 15) newCategories.under_15.push(String(id));
      else if (mins <= 30) newCategories.under_30.push(String(id));
      else if (mins <= 60) newCategories.under_60.push(String(id));
      else newCategories.over_60.push(String(id));
    }
    setCategory(newCategories);
  }, []);

  // Fetch dishes by ingredient
  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");

    const key = ingredient.trim().toLowerCase();
    if (!key) {
      setMessage("Enter an ingredient first");
      return;
    }

    // prevent duplicate API calls
    if (ingredientList.includes(key)) {
      setMessage(`"${key}" is already added`);
      return;
    }

    setIngredientList((prev) => [...prev, key]);

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
      key
    )}`;
    setLoading(true);

    try {
      const res = await axios.get(url);
      const tempArr = res.data.meals || null;

      setIngredientResults((prev) => ({
        ...prev,
        [key]: tempArr,
      }));
      setIngredient("");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while fetching. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Recompute dishes whenever ingredientResults changes
  React.useEffect(() => {
    const noDishKeys = Object.keys(ingredientResults).filter(
      (k) => !ingredientResults[k]?.length
    );
    setIngreListWithNoDishes(noDishKeys);
    setLockedNoMatch(noDishKeys.length > 0);

    const nonNullResults = Object.values(ingredientResults).filter(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
    if (!nonNullResults.length) {
      setDishes([]);
      setDishesWithTime([]);
      return;
    }

    let base = [...nonNullResults[0]];
    nonNullResults.slice(1).forEach((current) => {
      base = base.filter((item) =>
        current.some((c) => String(c.idMeal) === String(item.idMeal))
      );
    });

    setDishes(base);

    const activeTime = Object.keys(time).find((k) => time[k]);
    if (activeTime) {
      const catList = category[activeTime] || [];
      setDishesWithTime(
        base.filter((item) => catList.includes(String(item.idMeal)))
      );
    } else {
      setDishesWithTime([]);
    }
  }, [ingredientResults]);

  function handleReset() {
    setDishes([]);
    setIngredientList([]);
    setIngredient("");
    setDishesWithTime([]);
    setTime({
      under_15: false,
      under_30: false,
      under_60: false,
      over_60: false,
    });
    setMessage("");
    setIngredientResults({});
    setIngreListWithNoDishes([]);
    setLockedNoMatch(false);
  }

  function handleAll() {
    setShowChooseTime(false);
    setDishesWithTime([]);
    setTime({
      under_15: false,
      under_30: false,
      under_60: false,
      over_60: false,
    });
  }

  function handleTimeSelected(e) {
    const selected = e.currentTarget.dataset.name;
    setTime({
      under_15: false,
      under_30: false,
      under_60: false,
      over_60: false,
      [selected]: true,
    });

    const catList = category[selected] || [];
    setDishesWithTime(
      dishes.filter((item) => catList.includes(String(item.idMeal)))
    );
    setShowChooseTime(false);
  }

  const getTimeForDish = (id) => duration[String(id)] ?? 30;
 

  function handleRemove(ingre) {
    let filtered_ingredients = ingredientList.filter((item) => item !== ingre);
    setIngredientList(filtered_ingredients);
    setIngredientResults((prev) => {
    const updated = { ...prev };
    delete updated[ingre]; 
    return updated;
  });
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Title />
        </div>

        {/* Top info */}
        <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="text-sm text-zinc-600">
            Showing{" "}
            <span className="font-semibold text-pink-700">
              {dishesWithTime.length > 0
                ? dishesWithTime.length
                : dishes.length}
            </span>{" "}
            dishes
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={handleReset}
              className="flex gap-2 items-center bg-pink-200 text-pink-700 px-3 py-2 rounded-2xl shadow hover:scale-102 transition-transform"
            >
              <RiResetLeftFill />
              Reset
            </button>

            <div className="relative">
              <button
                onClick={() => setShowChooseTime((s) => !s)}
                className="flex gap-2 items-center bg-pink-200 text-pink-700 px-3 py-2 rounded-2xl shadow hover:scale-102 transition-transform"
              >
                <MdAccessTime />
                Duration
                <RiArrowDropDownLine />
              </button>

              <div
                className={`mt-2 w-44 right-0 absolute  rounded shadow-lg p-2 text-sm z-40 text-pink-700 bg-pink-100 transition-all duration-300 ease-in  ${
                  showChooseTime
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                } `}
              >
                <button
                  onClick={handleAll}
                  className="w-full text-left px-2 py-1 rounded hover:bg-pink-200"
                >
                  All
                </button>
                <hr className="my-1" />
                <button
                  data-name="under_15"
                  onClick={handleTimeSelected}
                  className="w-full text-left px-2 py-1 rounded hover:bg-pink-200"
                >
                  Under 15 mins
                </button>
                <hr className="my-1" />
                <button
                  data-name="under_30"
                  onClick={handleTimeSelected}
                  className="w-full text-left px-2 py-1 rounded hover:bg-pink-200"
                >
                  15 - 30 mins
                </button>
                <hr className="my-1" />
                <button
                  data-name="under_60"
                  onClick={handleTimeSelected}
                  className="w-full text-left px-2 py-1 rounded hover:bg-pink-200"
                >
                  30 - 60 mins
                </button>
                <hr className="my-1" />
                <button
                  data-name="over_60"
                  onClick={handleTimeSelected}
                  className="w-full text-left px-2 py-1 rounded hover:bg-pink-200"
                >
                  Over 1 hour
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search area */}
        <div className="mt-6">
          <form
            className="flex flex-row sm:flex-row items-stretch gap-2 max-w-3xl mx-auto"
            onSubmit={handleAdd}
          >
            <div className="relative flex-1">
              <input
                className="w-full p-3 rounded-l-md rounded-r-md bg-pink-100/75 border border-pink-100 outline-none text-pink-700 placeholder-pink-700"
                type="text"
                name="ingredient"
                placeholder="Enter ingredient (e.g. egg)"
                value={ingredient}
                onChange={(e) => {
                  setIngredient(e.target.value);
                  setMessage("");
                }}
              />
              <button
                type="submit"
                aria-label="Add ingredient"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-700 text-white p-2 rounded-full shadow hover:scale-105 transition-transform"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDropdown((s) => !s)}
                className="px-3 py-2 bg-pink-700 text-white rounded-md shadow"
              >
                <IoIosArrowDropdown />
              </button>
            </div>
          </form>

          <div className="max-w-3xl mx-auto mt-2">
            {loading && (
              <div className="text-sm text-pink-700 font-medium">
                Loading...
              </div>
            )}
            {message && !loading && (
              <div className="text-sm text-gray-700 mt-1">{message}</div>
            )}
          </div>

          {/* Ingredient list */}
          {ingredientList.length > 0 && (
            <div className="max-w-3xl mx-auto mt-3 flex flex-wrap gap-2">
              {ingredientList.map((it) => (
                <div
                  key={it}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow-sm ${
                    ingreListWithNoDishes.includes(it)
                      ? "bg-yellow-300 text-yellow-900"
                      : "bg-pink-100 text-pink-700"
                  }`}
                  title={
                    ingreListWithNoDishes.includes(it)
                      ? "No dishes found for this ingredient"
                      : ""
                  }
                >
                  {it}
                  {ingreListWithNoDishes.includes(it) && (
                    <FaExclamationTriangle size={12} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Warning message */}
          {lockedNoMatch && ingreListWithNoDishes.length > 0 && (
            <div className="text-yellow-900 mt-2 text-sm flex items-center gap-1">
              <FaExclamationTriangle />
              No dishes found for:{" "}
              <span className="font-semibold">
                {ingreListWithNoDishes.at(-1)}
              </span>
            </div>
          )}

          {/* Dropdown */}

          <div
            className={`max-w-3xl mx-auto mt-3 bg-white border-1 border-pink-300 rounded shadow p-1 transition-all duration-300 ease-in  ${
              showDropdown && ingredientList.length > 0
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-2 invisible"
            }`}
          >
            {ingredientList.map((item) => (
              <div
                onClick={() => handleRemove(item)}
                className="flex justify-between items-center px-2 py-1"
              >
                <div key={item} className=" text-pink-700 ">
                  {item}
                </div>
                <button className="text-[13px] text-pink-700 font-semibold bg-pink-100 px-2 py-1 rounded-md transition-all duration-300 ease-out hover:bg-pink-200 ">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* No dishes matched */}
        {!loading && dishes.length === 0 && ingredientList.length > 0 && (
          <div className="text-center text-gray-500 mt-8">
            No dishes matched your ingredient filters.
          </div>
        )}

        {/* Dish grid */}
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8 place-items-center">
            {(Object.values(time).some((t) => t) ? dishesWithTime : dishes).map(
              (item) => (
                <div key={item.idMeal} className="w-full flex justify-center">
                  <DishCard
                    img={item.strMealThumb}
                    name={item.strMeal}
                    time={getTimeForDish(item.idMeal)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {Object.values(time).some((t) => t) && dishesWithTime.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No dishes found for selected time filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
