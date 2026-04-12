const express = require('express');
const app = express();

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// PAY ROUTE
app.post("/pay", async (req, res) => {
  console.log("PAY ROUTE HIT");

  try {
    const { email } = req.body;
    console.log("EMAIL:", email);

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // fake payment link (for now)
    const checkout_url = "https://paystack.com/pay/test-payment";

    return res.json({
      status: "success",
      checkout_url: checkout_url
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
