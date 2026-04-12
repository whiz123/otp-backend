const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ===============================
// 🟢 GET ALL COUNTRIES
// ===============================
app.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/countries"
    );

    const countries = Object.keys(response.data);

    res.json(countries);

  } catch (err) {
    console.log(err.message);
    res.json({ error: "Failed to fetch countries" });
  }
});

// ===============================
// 🟢 GET SERVICES BY COUNTRY
// ===============================
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "nigeria";

    const response = await axios.get(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const services = Object.keys(response.data);

    res.json(services);

  } catch (err) {
    console.log(err.message);
    res.json({ error: "Failed to fetch services" });
  }
});

// ===============================
// 🚀 START SERVER
// ===============================
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
