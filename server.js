const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ✅ ADD THIS (VERY IMPORTANT - CORS FIX)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// ===============================
// 🟢 GET SERVICES
// ===============================
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "nigeria";

    const response = await axios.get(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = response.data;

    const services = Object.keys(data);

    res.json(services);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "Failed to fetch services" });
  }
});

// ===============================
// 🟢 GET COUNTRIES
// ===============================
app.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/countries"
    );

    const countries = Object.keys(response.data);

    res.json(countries);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "Failed to fetch countries" });
  }
});

// ===============================
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
