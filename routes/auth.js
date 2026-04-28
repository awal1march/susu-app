const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, phone, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    db.prepare(`
      INSERT INTO users (name, phone, password)
      VALUES (?, ?, ?)
    `).run(name, phone, hash);

    res.json({ message: "Registered" });
  } catch {
    res.status(400).json({ message: "User exists" });
  }
});

// LOGIN (PROTECTED BY TOKEN)
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE phone=?").get(phone);

  if (!user) return res.status(404).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user_id: user.id,
    name: user.name,
    wallet: user.wallet
  });
});

module.exports = router;