
const API = "http://localhost:3000";

let token = localStorage.getItem("token");


function show(msg) {
  document.getElementById("out").innerText = msg;
}

// REGISTER
async function register() {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      phone: phone.value,
      password: password.value
    })
  });

  const data = await res.json();
  show(data.message);
}

// LOGIN (PROTECTED)
async function login() {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: lphone.value,
      password: lpass.value
    })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    show("Login success");
  } else {
    show(data.message);
  }
}

// BALANCE (PROTECTED)
async function balance() {
  const res = await fetch(API + "/wallet/balance", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  show("Balance: " + data.wallet);
}

// PAYSTACK
function pay() {
  const email = document.getElementById("email").value;
  const amount = document.getElementById("amount").value;

  if (!email || !amount) {
    alert("Email and amount required");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_live_b99f70e00e05b7a053b2a0c053e6fafca414d645", // IMPORTANT
    email: email,
    amount: Number(amount) * 100,
    currency: "GHS",

    callback: function (response) {
      alert("Payment successful: " + response.reference);

      // verify on backend
      fetch(`${API}/paystack/verify/${response.reference}`)
        .then(res => res.json())
        .then(data => {
          alert(data.message);
        });

      getBalance();
    },

    onClose: function () {
      alert("Payment cancelled");
    }
  });

  handler.openIframe();
}