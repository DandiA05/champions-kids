const http = require("http");

const data = JSON.stringify({
  email: "admin@test.com",
  password: "admin123",
});

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log("Headers:", res.headers);

  if (res.headers["set-cookie"]) {
    console.log("SUCCESS: Set-Cookie header found!");
    res.headers["set-cookie"].forEach((cookie) =>
      console.log("Cookie:", cookie),
    );
  } else {
    console.log("FAILED: No Set-Cookie header found.");
  }

  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.log("Body:", body);
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
