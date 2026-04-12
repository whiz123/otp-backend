const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// 🌍 GET COUNTRIES (SORTED + TOP FIRST)
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(
      `https://5sim.net/v1/guest/prices?country=${country}`
    );

    const data = await r.json();

    // 🔥 STRICT FILTER (ONLY VALID SERVICES)
    const validServices = [];

    for (const key in data) {
      const value = data[key];

      // must be object AND contain operator with cost
      if (
        typeof value === "object" &&
        value !== null &&
        Object.values(value).some(v => v.cost)
      ) {
        validServices.push(key);
      }
    }

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
      ...priority.filter(p => validServices.includes(p)),
      ...validServices.filter(s => !priority.includes(s))
    ];

    res.json(sorted);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});


// 📱 GET SERVICES (POPULAR FIRST)
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

    const all = Object.keys(data);

    const sorted = [
      ...priority.filter(p => all.some(s => s.includes(p))),
      ...all.filter(s => !priority.some(p => s.includes(p)))
    ];

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
