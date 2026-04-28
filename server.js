require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/wallet", require("./routes/wallet"));
app.use("/paystack", require("./routes/paystack"));

app.get("/", (req, res) => {
  res.send("SUSU API running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});