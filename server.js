import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 🌍 GET COUNTRIES
app.get("/countries", async (req, res) => {
  try {
    const r = await fetch("https://5sim.net/v1/guest/countries");
    const data = await r.json();
    res.json(Object.keys(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// 📱 GET SERVICES
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    // 🔥 ONLY POPULAR SERVICES
    const popular = [
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

    const services = Object.keys(data).filter(s =>
      popular.some(p => s.includes(p))
    );

    res.json(services);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
