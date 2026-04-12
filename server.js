const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ===============================
// 🟢 GET SERVICES (WORKING FIX)
// ===============================
app.get("/services", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/prices?country=nigeria"
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
// 🚀 START SERVER
// ===============================
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
