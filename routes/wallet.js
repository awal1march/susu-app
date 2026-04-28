const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");

// GET BALANCE (PROTECTED)
router.get("/balance", auth, (req, res) => {
  const user = db
    .prepare("SELECT wallet FROM users WHERE id=?")
    .get(req.user.id);

  res.json({ wallet: user.wallet });
});

module.exports = router;