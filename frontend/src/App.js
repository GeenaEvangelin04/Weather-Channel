import React, { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CityInput from "./components/CityInput";
import WeatherDisplay from "./components/WeatherDisplay";
import "./App.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Context for managing city state
const WeatherContext = createContext();
export const useWeather = () => useContext(WeatherContext);

const App = () => {
  const [city, setCity] = useState("New York");

  return (
    <QueryClientProvider client={queryClient}>
      <WeatherContext.Provider value={{ city, setCity }}>
        <div className="app">
        <h1 className="weather-heading">The Weather Channel</h1>
          <CityInput />
          <WeatherDisplay />
        </div>
      </WeatherContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
