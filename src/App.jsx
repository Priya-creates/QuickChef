import React from "react";
import axios from "axios";
import { IoIosArrowDropdown } from "react-icons/io";
import DishCard from "./components/DishCard";
import Title from "./components/Title";
import { FaPlus } from "react-icons/fa";
import { duration } from "./assets/duration";
import { RiResetLeftFill } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

const App = () => {
  const [ingredient, setIngredient] = React.useState("");
  const [dishes, setDishes] = React.useState([]);
  const [ingredientList, setIngredientList] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showChooseTime, setShowChooseTime] = React.useState(false);
  const [dishesWithTime, setDishesWithTime] = React.useState([]);

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

  // fetch dishes by ingredient (filter.php)
  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");

    if (!ingredient.trim()) {
      setMessage("Enter an ingredient first");
      return;
    }

    if (!ingredientList.includes(ingredient.trim())) {
      setIngredientList((prev) => [...prev, ingredient.trim()]);
    }

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
      ingredient.trim()
    )}`;
    setIngredient("");
    setLoading(true);

    try {
      const res = await axios.get(url);
      const tempArr = res.data.meals || null;

      if (!tempArr) {
        setMessage(`No dishes found for "${ingredient.trim()}"`);
        setDishes([]);
        setDishesWithTime([]);
      } else {
        if (dishes.length === 0) {
          setDishes(tempArr);
        } else {
          const filter_arr = dishes.filter((dish) =>
            tempArr.some((tempDish) => tempDish.idMeal === dish.idMeal)
          );
          setDishes(filter_arr);
        }
        const activeTime = Object.keys(time).find((k) => time[k]);
        if (activeTime) filterByTime(activeTime);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while fetching. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // All (reset time filter to show all current dishes)
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

  React.useEffect(() => {
    function categorizeDuration() {
      const newCategories = {
        under_15: [],
        under_30: [],
        under_60: [],
        over_60: [],
      };

      for (const id in duration) {
        const mins = duration[id];
        if (mins <= 15) {
          newCategories.under_15.push(String(id));
        } else if (mins <= 30) {
          newCategories.under_30.push(String(id));
        } else if (mins <= 60) {
          newCategories.under_60.push(String(id));
        } else {
          newCategories.over_60.push(String(id));
        }
      }

      setCategory(newCategories);
    }

    categorizeDuration();
  }, []);


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
  }

  function filterByTime(cat) {
    if (!cat) return;
    if (!dishes || dishes.length === 0) {
      setDishesWithTime([]);
      return;
    }
    const catList = category[cat] || [];
    const filter_arr = dishes.filter((item) =>
      catList.includes(String(item.idMeal))
    );
    setDishesWithTime(filter_arr);
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
    filterByTime(selected);
    setShowChooseTime(false);
  }

  const getTimeForDish = (id) => {
    return duration[String(id)] ?? 30;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* more breathing room under heading */}
        <div className="mb-6">
          <Title />
        </div>

        {/* top info / count */}
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

              {showChooseTime && (
                <div className="mt-2 w-44 right-0 absolute bg-white rounded shadow-lg p-2 text-sm z-40">
                  <button
                    onClick={handleAll}
                    className="w-full text-left px-2 py-1 rounded hover:bg-pink-50"
                  >
                    All
                  </button>
                  <hr className="my-1" />
                  <button
                    data-name="under_15"
                    onClick={handleTimeSelected}
                    className="w-full text-left px-2 py-1 rounded hover:bg-pink-50"
                  >
                    Under 15 mins
                  </button>
                  <hr className="my-1" />
                  <button
                    data-name="under_30"
                    onClick={handleTimeSelected}
                    className="w-full text-left px-2 py-1 rounded hover:bg-pink-50"
                  >
                    15 - 30 mins
                  </button>
                  <hr className="my-1" />
                  <button
                    data-name="under_60"
                    onClick={handleTimeSelected}
                    className="w-full text-left px-2 py-1 rounded hover:bg-pink-50"
                  >
                    30 - 60 mins
                  </button>
                  <hr className="my-1" />
                  <button
                    data-name="over_60"
                    onClick={handleTimeSelected}
                    className="w-full text-left px-2 py-1 rounded hover:bg-pink-50"
                  >
                    Over 1 hour
                  </button>
                </div>
              )}
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
                className="w-full p-3 rounded-l-md rounded-r-md bg-pink-100/75 border border-pink-100 outline-none text-pink-800 placeholder-pink-400"
                type="text"
                name="ingredient"
                placeholder="Enter ingredient (e.g. egg, chicken, tomato)"
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
              <div className="text-sm text-red-600 mt-1">{message}</div>
            )}
          </div>

          {ingredientList.length > 0 && (
            <div className="max-w-3xl mx-auto mt-3 flex flex-wrap gap-2">
              {ingredientList.map((it) => (
                <div
                  key={it}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm shadow-sm"
                >
                  {it}
                </div>
              ))}
            </div>
          )}

          {showDropdown && ingredientList.length > 0 && (
            <div className="max-w-3xl mx-auto mt-3 bg-white border rounded shadow p-1">
              {ingredientList.map((item) => (
                <div
                  key={item}
                  className="px-2 py-1 text-pink-700 border-b last:border-b-0"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && dishes.length === 0 && ingredientList.length > 0 && (
          <div className="text-center text-gray-500 mt-8">
            No dishes matched your ingredient filters.
          </div>
        )}

        {/* Dish grid: responsive, centered items, md => 3 cols, lg => 4 cols */}
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
