const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // ✅ Load .env variables

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const API_KEY = process.env.API_KEY; // ✅ Use environment variable
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
