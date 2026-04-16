const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 YOUR 5SIM API KEY (UNTOUCHED)
const API_KEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDc0NzI3MjQsImlhdCI6MTc3NTkzNjcyNCwicmF5IjoiMjA4NWEyOGIxOWU0OTFlNWYzNzQzM2M3ODRiMmJlNGMiLCJzdWIiOjM5NjI3Nzd9.IxRiwmZLIOZ1fxsb97IFFXyXdDyHsbM1ALeOQ6qNmtyvqK2g6_WHecuPqHLknlwAzCiSzHnEfhqPGZYLX2MnmP0RAjV3f5U9v79GyRLFpGfoXLP-wvNKsPzN_9-52M4xo7nyI6vkNu65qgLOZNXAHvza90GELhboy2p-I3lNvJN3GCQ2rAwz7CoWtq3-pC02JQf5D_f9g_m-5jiPBM5GB-56rnCk-C6zSdNzyTBAnTjdYswV7kGnvteiUjqwBI9XCrbipW1INT5oLdLpIlmNhDWcqH3BV_cI7VIwvkBIHEhWdXMZD5y4JMHWo8G62Nlqt9XyS6G-DansCAdDKmLwqA";

// 🔒 prevent duplicate payment
const usedRefs = new Set();


// 🌍 COUNTRIES
app.get("/countries", async (req, res) => {
  try {
    const r = await fetch("https://5sim.net/v1/guest/countries");
    const data = await r.json();

    const priority = ["usa","england","canada","india","nigeria"];

    const all = Object.keys(data);

    const sorted = [
      ...priority.filter(c => all.includes(c)),
      ...all.filter(c => !priority.includes(c))
    ];

    res.json(sorted);

  } catch {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});


// 📱 SERVICES
app.get("/services", async (req, res) => {
  try {
    const country = req.query.country || "usa";

    const r = await fetch(`https://5sim.net/v1/guest/prices?country=${country}`);
    const data = await r.json();

    res.json(Object.keys(data[country] || {}));

  } catch {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});


// 💰 PRICE
app.get("/price", async (req, res) => {
  try {
    const { country, service } = req.query;

    const r = await fetch(`https://5sim.net/v1/guest/prices?country=${country}`);
    const data = await r.json();

    const serviceData = data[country]?.[service];
    if (!serviceData) return res.json({ price: 0 });

    const costUSD = Object.values(serviceData)[0]?.cost || 0;

    const finalPrice = Math.ceil(costUSD * 1500 + 3000);

    res.json({ price: finalPrice });

  } catch {
    res.status(500).json({ error: "Failed to get price" });
  }
});


// 🔥 BUY NUMBER (WALLET)
app.post("/buy-number", async (req, res) => {
  try {
    const { country, service, email, price } = req.body;

    global.users = global.users || {};

    if (!global.users[email]) {
      global.users[email] = { balance: 0 };
    }

    const user = global.users[email];

    if (user.balance < price) {
      return res.json({ error: "Insufficient balance" });
    }

    user.balance -= price;

    const r = await fetch(
      `https://5sim.net/v1/user/buy/activation/${country}/any/${service}`,
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
    res.status(500).json({ error: "Buy failed" });
  }
});


// 📩 CHECK OTP
app.get("/check", async (req, res) => {
  try {
    const r = await fetch(
      `https://5sim.net/v1/user/check/${req.query.id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(await r.json());

  } catch {
    res.status(500).json({ error: "Check failed" });
  }
});


// 💳 FUND WALLET (FIXED)
app.post("/fund-wallet", async (req, res) => {
  try {
    const { email, amount } = req.body;

    const reference = "FUND_" + Date.now();

    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KORAPAY_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        currency: "NGN",
        reference,
        customer: { email },
        redirect_url: "https://otp-site.onrender.com/success.html?type=fund"
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Funding failed" });
  }
});


// ✅ VERIFY PAYMENT (SECURED)
app.post("/verify-payment", async (req, res) => {
  try {
    const { reference } = req.body;

    if (usedRefs.has(reference)) {
      return res.json({ success: false });
    }

    const verify = await fetch(
      `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORAPAY_SECRET}`
        }
      }
    );

    const data = await verify.json();

    if (data.status && data.data.status === "success") {

      usedRefs.add(reference);

      const email = data.data.customer.email;
      const amount = data.data.amount;

      global.users = global.users || {};

      if (!global.users[email]) {
        global.users[email] = { balance: 0 };
      }

      global.users[email].balance += amount;

      return res.json({ success: true });

    }

    res.json({ success: false });

  } catch {
    res.json({ success: false });
  }
});


// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
