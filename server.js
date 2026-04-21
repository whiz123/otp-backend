console.log("🔥 NEW VERSION DEPLOYED");

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

const User = mongoose.model("User", {
  email: String,
  balance: { type: Number, default: 0 }
});

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 5SIM
const API_KEY = "YOUR_5SIM_KEY";
const usedRefs = new Set();


// 🌍 COUNTRIES
app.get("/countries", async (req, res) => {
  try {
    const r = await fetch("https://5sim.net/v1/guest/countries");
    const data = await r.json();

    const priority = ["usa","england","canada","india","nigeria","germany","france"];
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

    const servicesObj = data[country] || {};
    res.json(Object.keys(servicesObj));
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

    const first = Object.values(serviceData)[0];
    const costNGN = first.cost * 1500;

    const finalPrice = Math.ceil(costNGN + 3000);
    res.json({ price: finalPrice });

  } catch {
    res.status(500).json({ error: "Failed" });
  }
});


// 🔥 BUY NUMBER (NO VERIFY HERE)
app.post("/buy-number", async (req, res) => {
  try {
    const { country, service, reference } = req.body;

    if (!reference) return res.json({ error: "No reference" });
    if (usedRefs.has(reference)) return res.json({ error: "Used" });

    usedRefs.add(reference);

    const r = await fetch(
      `https://5sim.net/v1/user/buy/activation/${country}/any/${service}`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` }
      }
    );

    const result = await r.json();
    res.json(result);

  } catch {
    res.status(500).json({ error: "Failed" });
  }
});


// 📩 CHECK OTP
app.get("/check", async (req, res) => {
  const { id } = req.query;

  const r = await fetch(`https://5sim.net/v1/user/check/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });

  const data = await r.json();
  res.json(data);
});


// 💳 FUND WALLET
app.post("/fund-wallet", async (req, res) => {
  try {
    const { email, amount } = req.body;

    const reference = "FUND_" + Date.now();

    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Number(amount),
        currency: "NGN",
        reference,
        customer: { email },
        redirect_url: `https://otp-site.onrender.com/success.html?reference=${reference}`
      })
    });

    const data = await response.json();

    res.json({
      checkout_url: data?.data?.checkout_url
    });

  } catch {
    res.json({ error: "Failed" });
  }
});


// 🔥 VERIFY PAYMENT (ONLY ONE)
app.get("/verify-payment", async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await fetch(
      `https://api.korapay.com/merchant/api/v1/transactions/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`
        }
      }
    );

    const result = await response.json();
    const data = result?.data;

    if (data?.status === "success" || data?.status === "successful") {

      const email = data.customer?.email;
      const amount = data.amount;

      let user = await User.findOne({ email });

      if (!user) user = new User({ email, balance: 0 });

      user.balance += amount;
      await user.save();

      return res.json({ success: true });
    }

    res.json({ success: false });

  } catch {
    res.json({ success: false });
  }
});


// 💰 BALANCE
app.get("/balance", async (req, res) => {
  const user = await User.findOne({ email: req.query.email });
  res.json({ balance: user?.balance || 0 });
});


app.get("/", (req, res) => {
  res.send("Backend running");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running"));
