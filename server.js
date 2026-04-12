const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const API_KEY = "YOUR_5SIM_API_KEY"; // paste your key here

// 🟢 GET SERVICES
app.get("/services", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/products"
    );

    const data = response.data;

    const services = Object.keys(data);

    res.json(services);
  } catch (err) {
    console.log(err.message);
    res.json({ error: "Failed to fetch services" });
  }
});

// 🟢 GET COUNTRIES
app.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/countries"
    );

    res.json(Object.keys(response.data));
  } catch (err) {
    res.json({ error: "Failed to fetch countries" });
  }
});

app.listen(10000, () => {
  console.log("Server running");
});
