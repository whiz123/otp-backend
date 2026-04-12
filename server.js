const express = require('express');
const app = express();

app.use(express.json());

app.post('/pay', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ error: 'Email required' });
  }

  // fake payment link (we will replace later)
  const checkout_url = "https://paystack.com/pay/test-payment";

  res.json({ checkout_url });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});