async function testLogin() {
  const payload = {
    email: "admin@test.com",
    password: "admin123",
  };

  console.log("Testing login with:", payload);

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("Login SUCCESSFUL!");
    } else {
      console.log("Login FAILED.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testLogin();
