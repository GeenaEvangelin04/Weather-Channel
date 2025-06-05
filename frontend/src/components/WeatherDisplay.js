import React, { useEffect, useState } from "react";
import { useWeather } from "../App";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./WeatherDisplay.css";
import { motion } from "framer-motion";
import AnimatedWeatherIcon from "react-animated-weather";
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiRaindrop, WiBarometer } from "react-icons/wi";

const fetchWeather = async (city) => {
  try {
    // Trim city name and encode it to handle spaces properly
    const trimmedCity = city.trim();
    const response = await axios.get(`/.netlify/functions/getWeather?city=${encodeURIComponent(trimmedCity)}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("City not found");
    }
    throw new Error("Failed to fetch weather data");
  }
};

const getIconColor = (condition) => {
  if (condition.includes("clear")) return "#FFD700";
  if (condition.includes("cloud")) return "#4e6275";
  if (condition.includes("rain")) return "#4FC3F7";
  if (condition.includes("snow")) return "#B3E5FC";
  if (condition.includes("thunderstorm")) return "#FF8A65";
  return "#ffffff";
};

const WeatherDisplay = () => {
  const { city } = useWeather();
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    staleTime: 600000,
  });

  const [background, setBackground] = useState("linear-gradient(to right, #4facfe, #00f2fe)");
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [windSpeedUnit, setWindSpeedUnit] = useState("m/s");

  useEffect(() => {
    if (data) {
      const weatherType = data.weather[0].main.toLowerCase();

      const iconMap = {
        clear: { icon: "CLEAR_DAY", bg: "linear-gradient(to left,rgb(127, 231, 132),rgb(5, 184, 29))" },
        clouds: { icon: "CLOUDY", bg: "linear-gradient(to left, #bdc3c7, #2c3e50)" },
        rain: { icon: "RAIN", bg: "linear-gradient(to left, #4B79A1, #283E51)" },
        snow: { icon: "SNOW", bg: "linear-gradient(to left, #e6dada, #274046)" },
        thunderstorm: { icon: "WIND", bg: "linear-gradient(to left, #232526, #414345)" },
        default: { icon: "PARTLY_CLOUDY_DAY", bg: "linear-gradient(to left, #2980B9, #6DD5FA)" },
      };

      const { icon, bg } = iconMap[weatherType] || iconMap["default"];
      const iconColor = getIconColor(weatherType);

      setBackground(bg);
      setWeatherIcon(
        <AnimatedWeatherIcon
          icon={icon}
          color={iconColor}
          size={120}
          animate={true}
        />
      );
    }
  }, [data]);

  if (isLoading) return <p className="loading">Loading...</p>;

  if (error) {
    return (
      <motion.div 
        className="error-container" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="error-message">
          ❌ {error.message}
        </div>
      </motion.div>
    );
  }

  const toggleWindSpeedUnit = () => {
    setWindSpeedUnit((prev) => (prev === "m/s" ? "km/h" : "m/s"));
  };

  const windSpeed = windSpeedUnit === "m/s" ? data.wind.speed : (data.wind.speed * 3.6).toFixed(1);
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const currentTime = new Date();
  const progress = ((currentTime - sunrise) / (sunset - sunrise)) * 100;

  return (
    <motion.div className="weather-container stylish-bg">
      <motion.div 
        className="weather-card glass-effect stylish-card"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="weather-bg-overlay" style={{ background }}></div>

        <div className="weather-icon icon-highlight">{weatherIcon}</div>
        <h2 className="city-name bold-text">{data.name}</h2>
        <p className="temperature large-text">{data.main.temp}°C</p>
        <p className="weather-desc italic-text">{data.weather[0].description}</p>

        <div className="sunrise-sunset-bar">
          <WiSunrise size={30} />
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <WiSunset size={30} />
        </div>

        <div className="time-labels">
          <span>{sunrise.toLocaleTimeString()}</span>
          <span>{sunset.toLocaleTimeString()}</span>
        </div>

        <div className="weather-details-grid">
          <div className="detail-item"><WiHumidity size={30} /> Humidity: {data.main.humidity}%</div>
          <div className="detail-item"><WiRaindrop size={30} /> Rain: {data.rain ? `${data.rain['1h']} mm` : "No Rain"}</div>
          <div className="detail-item">
            <WiStrongWind size={30} /> Wind Speed: {windSpeed} {windSpeedUnit} 
            <button className="toggle-btn stylish-button" onClick={toggleWindSpeedUnit}>Toggle Unit</button>
          </div>
          <div className="detail-item"><WiBarometer size={30} /> Pressure: {data.main.pressure}mb</div>
        </div>

        <p className="radar-map link-text">
          <a href={`https://www.windy.com/?${data.coord.lat},${data.coord.lon},10`} target="_blank" rel="noopener noreferrer">
            View Radar Map
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WeatherDisplay;
