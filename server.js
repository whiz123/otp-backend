const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// 🌍 COUNTRIES
app.get("/countries", async (req, res) => {
  try {
    const r = await fetch("https://5sim.net/v1/guest/countries");
    const data = await r.json();
    res.json(Object.keys(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// 📱 SERVICES
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    // 🔥 FIX: access inner object
    const servicesObj = data[country] || {};

    const priority = [
      "whatsapp",
      "telegram",
      "facebook",
      "instagram",
      "twitter",
      "tiktok",
      "twitch",
      "google",
      "googlevoice",
      "youtube"
    ];

    const all = Object.keys(servicesObj);

    const sorted = [
      ...priority.filter(p => all.includes(p)),
      ...all.filter(s => !priority.includes(s))
    ];

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
