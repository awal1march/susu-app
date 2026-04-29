
const API = "https://susu-app-142y.onrender.com"; // change to Render URL later

console.log("APP JS LOADED ✅");

let token = localStorage.getItem("token");
let isLoggedIn = false;
let currentUser = null;

// MESSAGE
function show(msg) {
  const el = document.getElementById("out");
  if (el) el.innerText = msg;
}

// TAB SWITCH
function showTab(tab) {
  if (tab === "wallet" && !isLoggedIn) {
    show("Please login first ❌");
    return;
  }

  document.getElementById("auth").classList.add("hidden");
  document.getElementById("wallet").classList.add("hidden");

  document.getElementById("tabAuth").classList.remove("active");
  document.getElementById("tabWallet").classList.remove("active");

  document.getElementById(tab).classList.remove("hidden");

  if (tab === "auth") document.getElementById("tabAuth").classList.add("active");
  if (tab === "wallet") document.getElementById("tabWallet").classList.add("active");
}

// REGISTER
async function register() {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();
  show(data.message || data.error);
}

// LOGIN
async function login() {
  const phone = document.getElementById("lphone").value;
  const password = document.getElementById("lpass").value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();

  if (res.ok) {
    isLoggedIn = true;
    currentUser = phone;

    localStorage.setItem("token", data.token || "");
    localStorage.setItem("user", phone);

    token = data.token;

    show("Login successful ✅");
    showTab("wallet");
  } else {
    show(data.error || "Login failed ❌");
  }
}

// BALANCE
async function balance() {
  if (!isLoggedIn) return show("Login required ❌");

  const res = await fetch(API + "/wallet/balance", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  document.getElementById("bal").innerText =
    "GHS " + (data.balance || data.wallet || 0);
}

// PAYSTACK
function pay() {
  if (!isLoggedIn) return show("Login required ❌");

  const email = document.getElementById("email").value;
  const amount = document.getElementById("amount").value;

  if (!email || !amount) return show("Fill all fields ❌");

  const handler = PaystackPop.setup({
    key:"pk_live_b99f70e00e05b7a053b2a0c053e6fafca414d645",
    email,
    amount: amount * 100,
    currency: "GHS",

    callback: function (res) {
      fetch(`${API}/paystack/verify/${res.reference}`)
        .then(r => r.json())
        .then(d => {
          show(d.message || "Payment success");
          balance();
        });
    }
  });

  handler.openIframe();
}

// LOGOUT
function logout() {
  isLoggedIn = false;
  currentUser = null;
  token = null;

  localStorage.clear();

  show("Logged out");
  showTab("auth");
}

// BUTTON CONNECTIONS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerBtn").onclick = register;
  document.getElementById("loginBtn").onclick = login;
  document.getElementById("balanceBtn").onclick = balance;
  document.getElementById("payBtn").onclick = pay;
  document.getElementById("logoutBtn").onclick = logout;

  document.getElementById("tabAuth").onclick = () => showTab("auth");
  document.getElementById("tabWallet").onclick = () => showTab("wallet");
});