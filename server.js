const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());


// 🌍 GET COUNTRIES (TOP FIRST)
app.get("/countries", async (req, res) => {
  try {
    const r = await fetch("https://5sim.net/v1/guest/countries");
    const data = await r.json();

    const priority = [
      "usa", "england", "canada", "india",
      "nigeria", "germany", "france",
      "netherlands", "sweden", "brazil",
      "spain", "italy", "turkey"
    ];

    const all = Object.keys(data);

    const sorted = [
      ...priority.filter(c => all.includes(c)),
      ...all.filter(c => !priority.includes(c))
    ];

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});


// 📱 GET SERVICES (FIXED CLEAN)
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

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

    // ✅ ONLY VALID SERVICES (REMOVE COUNTRY KEYS)
    const all = Object.keys(data).filter(
      key => typeof data[key] === "object"
    );

    const sorted = [
      ...priority.filter(p => all.some(s => s.includes(p))),
      ...all.filter(s => !priority.some(p => s.includes(p)))
    ];

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});


// 🚀 FIXED PORT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
