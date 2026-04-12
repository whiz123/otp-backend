const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ✅ CORS FIX (VERY IMPORTANT)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// ===============================
// 🌍 GET COUNTRIES (ALL COUNTRIES)
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
// 📱 GET SERVICES (FIXED 🔥)
// ===============================
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "nigeria";

    const response = await axios.get(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = response.data;

    // ✅ CORRECT FIX (VERY IMPORTANT)
    const services = Object.keys(data[country] || {});

    res.json(services);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "Failed to fetch services" });
  }
});

// ===============================
// 🚀 START SERVER
// ===============================
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
