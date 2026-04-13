const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // ✅ ADD THIS HERE

// 🔐 YOUR 5SIM API KEY
const API_KEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDc0NzI3MjQsImlhdCI6MTc3NTkzNjcyNCwicmF5IjoiMjA4NWEyOGIxOWU0OTFlNWYzNzQzM2M3ODRiMmJlNGMiLCJzdWIiOjM5NjI3Nzd9.IxRiwmZLIOZ1fxsb97IFFXyXdDyHsbM1ALeOQ6qNmtyvqK2g6_WHecuPqHLknlwAzCiSzHnEfhqPGZYLX2MnmP0RAjV3f5U9v79GyRLFpGfoXLP-wvNKsPzN_9-52M4xo7nyI6vkNu65qgLOZNXAHvza90GELhboy2p-I3lNvJN3GCQ2rAwz7CoWtq3-pC02JQf5D_f9g_m-5jiPBM5GB-56rnCk-C6zSdNzyTBAnTjdYswV7kGnvteiUjqwBI9XCrbipW1INT5oLdLpIlmNhDWcqH3BV_cI7VIwvkBIHEhWdXMZD5y4JMHWo8G62Nlqt9XyS6G-DansCAdDKmLwqA";


// 🌍 COUNTRIES (TOP FIRST)
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


// 📱 SERVICES
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


// 💰 PRICE (YOUR LOGIC)
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

    const rate = 1500;
    const costNGN = costUSD * rate;

    let profit = 3000;

    const highTier = ["usa", "england", "canada", "australia"];

    const africa = [
      "nigeria", "ghana", "kenya", "southafrica",
      "uganda", "tanzania", "cameroon", "senegal",
      "ivorycoast", "ethiopia"
    ];

    if (country === "italy" && service.includes("whatsapp")) {
      profit = 5000;
    }
    else if (highTier.includes(country)) {
      profit = 3500;
    }
    else if (africa.includes(country)) {
      profit = 2500;
    }

    const finalPrice = Math.ceil(costNGN + profit);

    res.json({ price: finalPrice });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to get price" });
  }
});


// 🔥 BUY NUMBER (REAL)
app.get("/buy", async (req, res) => {
  try {
    const { country, service } = req.query;

    const r = await fetch(
      `https://5sim.net/v1/user/buy/activation/${country}/any/${service}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const text = await r.text();

console.log("RAW 5SIM RESPONSE:", text);

let data;

try {
  data = JSON.parse(text);
} catch {
  data = { error: text };
}

res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to buy number" });
  }
});


// 📩 CHECK OTP
app.get("/check", async (req, res) => {
  try {
    const { id } = req.query;

    const r = await fetch(
      `https://5sim.net/v1/user/check/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const data = await r.json();

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to check SMS" });
  }
});


// 🔥👇 PASTE YOUR KORAPAY CODE HERE
app.post("/create-payment", async (req, res) => {
  try {
    const { email, amount, country, service } = req.body;

    const reference = "OTP_" + Date.now();

    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    amount: amount * 100,
    currency: "NGN",
    email: email,
    reference: reference,
    callback_url: "https://otp-site.onrender.com/success"
  })
});

    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Payment failed" });
  }
});


// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
