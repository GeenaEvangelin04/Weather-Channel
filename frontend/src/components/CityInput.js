import React, { useState } from "react";
import { useWeather } from "../App";
import "./CityInput.css";

const CityInput = () => {
  const { setCity } = useWeather();
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (input.trim()) {
      setCity(input);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="city-input-container">
      <input 
        type="text" 
        placeholder="Enter city..." 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress} // Added event listener for Enter key
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default CityInput;
