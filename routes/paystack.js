const router = require("express").Router();
const axios = require("axios");
const db = require("../db");
const auth = require("../middleware/auth");

// INIT PAYMENT
router.post("/init", auth, async (req, res) => {
  const { email, amount } = req.body;

  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: amount * 100,
      metadata: { userId: req.user.id }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
      }
    }
  );

  res.json(response.data.data);
});

// VERIFY PAYMENT
router.get("/verify/:ref", async (req, res) => {
  const ref = req.params.ref;

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
      }
    }
  );

  const data = response.data.data;

  if (data.status !== "success") {
    return res.json({ message: "Failed" });
  }

  const amount = data.amount / 100;
  const userId = data.metadata.userId;

  db.prepare(`
    UPDATE users SET wallet = wallet + ? WHERE id=?
  `).run(amount, userId);

  db.prepare(`
    INSERT OR IGNORE INTO transactions (reference, user_id, amount, status)
    VALUES (?, ?, ?, 'success')
  `).run(ref, userId, amount);

  res.json({ message: "Wallet updated" });
});

module.exports = router;