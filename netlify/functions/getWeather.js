const axios = require("axios");

exports.handler = async function(event, context) {
  let city = event.queryStringParameters.city;
  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "City parameter is required" })
    };
  }

  city = city.trim();  // 🪄 Trim whitespace

  const API_KEY = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "City not found" })
      };
    }
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data" })
    };
  }
};
