const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/pay", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ error: "Email required" });
  }

  try {
    const response = await axios.post(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {
        amount: 4000,
        currency: "NGN",
        customer: {
          email: email
        },
        reference: "ref_" + Date.now(),
        redirect_url: "https://otp-site.onrender.com"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;

    if (data.status && data.data.checkout_url) {
      res.json({ checkout_url: data.data.checkout_url });
    } else {
      console.log(data);
      res.json({ error: "Payment failed" });
    }

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.json({ error: "Server error" });
  }
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
