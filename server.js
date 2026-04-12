app.post('/pay', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ error: 'Email required' });
  }

  const totalAmount = 4000; // ✅ fixed price for now

  try {
    const response = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.KORAPAY_SECRET_KEY
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: "NGN",
        email: email,
        reference: "ref_" + Date.now(),
        redirect_url: "https://otp-site.onrender.com"
      })
    });

    const data = await response.json();

    if (data.status && data.data.checkout_url) {
      res.json({ checkout_url: data.data.checkout_url });
    } else {
      console.log(data);
      res.json({ error: "Payment failed" });
    }

  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
});
