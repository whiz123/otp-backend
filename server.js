const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// 🌍 COUNTRIES (TOP FIRST — FIXED)
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

// 📱 SERVICES (WORKING)
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

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

// 💰 PRICE (FINAL BUSINESS LOGIC)
app.get("/price", async (req, res) => {
  try {
    const country = req.query.country;
    const service = req.query.service;

    if (!country || !service) {
      return res.json({ price: 0 });
    }

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    const serviceData = data[country]?.[service];

    if (!serviceData) {
      return res.json({ price: 0 });
    }

    const first = Object.values(serviceData)[0];

    if (!first || !first.cost) {
      return res.json({ price: 0 });
    }

    const costUSD = first.cost;

    // 💱 YOUR RATE
    const rate = 1500;
    const costNGN = costUSD * rate;

    // 🔥 PROFIT SYSTEM
    let profit = 3000;

    const highTier = ["usa", "england", "canada", "australia"];

    const africa = [
      "nigeria", "ghana", "kenya", "southafrica",
      "uganda", "tanzania", "cameroon", "senegal",
      "ivorycoast", "ethiopia"
    ];

    // 🇮🇹 SPECIAL CASE (ITALY WHATSAPP)
    if (country === "italy" && service.includes("whatsapp")) {
      profit = 5000;
    }
    // 🌍 HIGH TIER
    else if (highTier.includes(country)) {
      profit = 3500;
    }
    // 🌍 AFRICA
    else if (africa.includes(country)) {
      profit = 2500;
    }
    // 🌎 OTHERS
    else {
      profit = 3000;
    }

    const finalPrice = Math.ceil(costNGN + profit);

    res.json({ price: finalPrice });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get price" });
  }
});

// 🚀 SERVER MUST BE LAST
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
