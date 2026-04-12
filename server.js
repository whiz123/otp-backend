const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔐 YOUR 5SIM API KEY (IMPORTANT for later steps)
const API_KEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDc0NzI3MjQsImlhdCI6MTc3NTkzNjcyNCwicmF5IjoiMjA4NWEyOGIxOWU0OTFlNWYzNzQzM2M3ODRiMmJlNGMiLCJzdWIiOjM5NjI3Nzd9.IxRiwmZLIOZ1fxsb97IFFXyXdDyHsbM1ALeOQ6qNmtyvqK2g6_WHecuPqHLknlwAzCiSzHnEfhqPGZYLX2MnmP0RAjV3f5U9v79GyRLFpGfoXLP-wvNKsPzN_9-52M4xo7nyI6vkNu65qgLOZNXAHvza90GELhboy2p-I3lNvJN3GCQ2rAwz7CoWtq3-pC02JQf5D_f9g_m-5jiPBM5GB-56rnCk-C6zSdNzyTBAnTjdYswV7kGnvteiUjqwBI9XCrbipW1INT5oLdLpIlmNhDWcqH3BV_cI7VIwvkBIHEhWdXMZD5y4JMHWo8G62Nlqt9XyS6G-DansCAdDKmLwqA";

// ===============================
// 🟢 GET ALL SERVICES
// ===============================
app.get("/services", async (req, res) => {
  try {
    const response = await axios.get(
      "https://5sim.net/v1/guest/prices"
    );

    const data = response.data;

    // get all services
    const services = Object.keys(data);

    res.json(services);

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "Failed to fetch services" });
  }
});

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
