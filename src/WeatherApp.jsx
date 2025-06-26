import React, { useState, useEffect } from "react";
import axios from "axios";
import main from "../config/gemini"; // Gemini API function

function WeatherApp() {
  const [city, setCity] = useState("Karachi");
  const [weatherData, setWeatherData] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "10a055c09f8a93ff1fcfc3ae3ffe74f3";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const getCustomIcon = (description) => {
    const lower = description.toLowerCase();
    if (lower.includes("clear")) return "public/icons/clear.svg";
    if (lower.includes("clouds")) return "public/icons/cloudy.svg";
    if (lower.includes("rain")) return "public/icons/rainy.svg";
    if (lower.includes("snow")) return "public/icons/snowy.svg";
    if (lower.includes("thunderstorm")) return "public/icons/thunderstorm.svg";
    if (lower.includes("sunny")) return "public/icons/sunny.svg";
    return ""; // fallback
  };

  const iconUrl =
    weatherData ? getCustomIcon(weatherData.weather[0].description) : "";

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

const fetchWeatherData = async () => {
  if (!city) return;
  setLoading(true);
  setWeatherData(null);
  setSummary("");

  try {
    const response = await axios.get(apiUrl);
    setWeatherData(response.data);

    const prompt = `Give a short one-line current weather recommendation for the city "${city}". Temperature: ${response.data.main.temp}°C. Weather: ${response.data.weather[0].description}. Add one extra detail if possible.`;
    const geminiSummary = await main(prompt);
    setSummary(geminiSummary.trim());
  } catch (error) {
    console.error("Error fetching weather data or summary:", error);
    setSummary("Couldn't fetch weather summary.");
  }

  setLoading(false);
};

useEffect(() => {
  fetchWeatherData();
  // eslint-disable-next-line
}, []);

  return (
    <>
      <div className="mx-50">
        <h1 className="text-3xl font-bold text-center mt-10 text-blue-600">
          Weather App
        </h1>

        <div className="bg-gradient-to-t from-sky-500 to-indigo-500 p-4 mt-6 rounded-lg shadow-lg items-center flex-col justify-center w-1/2 mx-auto">
          <div className="mt-5 p-5 rounded-lg mx-auto flex items-center justify-center">
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className="border-2 border-gray-300 p-2 rounded-lg bg-white text-2xl text-slate-600 font-semibold border-none focus:border-indigo-500 focus:outline-none w-full max-w-md"
            />
            <button
              className="bg-indigo-700 text-white p-3 rounded-lg ml-2 text-xl font-semibold"
              onClick={fetchWeatherData}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {weatherData && (
            <div className="text-white flex flex-col items-center gap-1.5">
              <h2 className="text-4xl font-bold">{weatherData.name}</h2>

              <img
                src={`https://flagcdn.com/w80/${weatherData.sys.country.toLowerCase()}.png`}
                alt={weatherData.sys.country}
                className="w-12 h-8 rounded shadow-md"
              />

              <img
                src={iconUrl}
                alt={weatherData.weather[0].description}
                className="w-24 h-24 transition-transform hover:scale-110 duration-300"
              />

              <p className="text-3xl text-slate-200 font-bold">
                {weatherData.main.temp}°C
              </p>
              <p className="text-3xl uppercase">
                {weatherData.weather[0].description}
              </p>

              <div className="flex justify-evenly mt-5 mb-4 w-full">
                <p className="text-xl">
                  Humidity: {weatherData.main.humidity}%
                </p>
                <p className="text-xl">
                  Wind Speed: {weatherData.wind.speed} m/s
                </p>
              </div>
            </div>
          )}

          {summary && (
            <div className="bg-slate-200 p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold">Recommended</h3>
              <p className="text-slate-600">{summary}</p>
            </div>
          )}

          <div>
            <p className="text-slate-300 text-sm font-semibold mt-4">
              Powered by OpenWeather & Gemini AI
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WeatherApp;
