const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());


// 🌍 COUNTRIES (TOP FIRST LIKE BEFORE)
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


// 📱 SERVICES (DO NOT BREAK AGAIN)
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    // ✅ CORRECT STRUCTURE
    const servicesObj = data;

    // ✅ FILTER VALID SERVICES ONLY
    const all = Object.keys(servicesObj).filter(
      s =>
        typeof servicesObj[s] === "object" &&
        Object.values(servicesObj[s])[0]?.cost !== undefined
    );

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

    const sorted = [
      ...priority.filter(p => all.includes(p)),
      ...all.filter(s => !priority.includes(s))
    ];

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});


// 💰 PRICE (WITH YOUR PROFIT SYSTEM)
app.get("/price", async (req, res) => {
  try {
    const country = req.query.country;
    const service = req.query.service;

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    const serviceData = data[service];

    if (!serviceData) {
      return res.json({ price: 0 });
    }

    const first = Object.values(serviceData)[0];

    if (!first || !first.cost) {
      return res.json({ price: 0 });
    }

    const costUSD = first.cost;

    const rate = 1500;
    const costNGN = costUSD * rate;

    // 🔥 PROFIT SYSTEM
    let profit = 3000;

    const highTier = ["usa", "england", "canada"];

    const africa = [
      "nigeria", "ghana", "kenya", "southafrica",
      "uganda", "tanzania", "cameroon", "senegal",
      "ivorycoast", "ethiopia"
    ];

    if (highTier.includes(country)) {
      profit = 3500;
    } else if (africa.includes(country)) {
      profit = 2500;
    }

    const finalPrice = Math.ceil(costNGN + profit);

    res.json({ price: finalPrice });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get price" });
  }
});


// 🚀 PORT (RENDER SAFE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
