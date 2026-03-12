async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");

  // Clear messages
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      successMsg.textContent = "Login successful! Redirecting...";
      successMsg.style.display = "block";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      errorMsg.textContent = data.error || "Login failed";
      errorMsg.style.display = "block";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMsg.textContent = "Connection error. Please try again.";
    errorMsg.style.display = "block";
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorMsg = document.getElementById("errorMsg");
  const successMsg = document.getElementById("successMsg");

  // Clear messages
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  // Validate passwords match
  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      successMsg.textContent = "Account created successfully! You can now login.";
      successMsg.style.display = "block";
      setTimeout(() => {
        toggleForm(); // Switch to login form
        document.getElementById("registerForm").reset();
      }, 2000);
    } else {
      errorMsg.textContent = data.error || "Registration failed";
      errorMsg.style.display = "block";
    }
  } catch (error) {
    console.error("Registration error:", error);
    errorMsg.textContent = "Connection error. Please try again.";
    errorMsg.style.display = "block";
  }
}

function toggleForm() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const formTitle = document.getElementById("formTitle");
  const switchText = document.getElementById("switchText");

  if (loginForm.classList.contains("hidden")) {
    // Show login form
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    formTitle.textContent = "Institute Management";
    switchText.textContent = "Don't have an account? Create one";
  } else {
    // Show register form
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    formTitle.textContent = "Create Account";
    switchText.textContent = "Already have an account? Login";
  }

  // Clear any messages
  document.getElementById("errorMsg").style.display = "none";
  document.getElementById("successMsg").style.display = "none";
}

async function checkSession() {
  try {
    const response = await fetch("http://localhost:3000/check-session", {
      credentials: "include",
    });
    const data = await response.json();
    return data.loggedIn;
  } catch (error) {
    console.error("Session check error:", error);
    return false;
  }
}

async function loadData() {
  try {
    const response = await fetch("http://localhost:3000/enrollments", {
      credentials: "include",
    });

    if (response.status === 401) {
      alert("Session expired. Please login again.");
      window.location.href = "index.html";
      return;
    }

    const data = await response.json();

    const table = document.getElementById("tableData");
    table.innerHTML = "";

    data.forEach((row) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row.student}</td>
        <td>${row.course}</td>
        <td>${row.fee}</td>
        <td>${new Date(row.enrollment_date).toLocaleDateString()}</td>
      `;

      table.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data");
  }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// execute a custom SELECT query and display results
async function runQuery() {
  const query = document.getElementById("sqlQuery").value.trim();
  if (!query) {
    alert("Please enter a SQL query");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/execute-query", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
      } else {
        alert("Query Error: " + (data.error || "Failed to execute query"));
      }
      return;
    }

    showQueryResult(data.fields, data.rows);
  } catch (err) {
    console.error("Query error:", err);
    alert("Connection Error: Could not reach server. Make sure http://localhost:3000 is running.");
  }
}

function showQueryResult(fields, rows) {
  const head = document.getElementById("queryHead");
  const body = document.getElementById("queryBody");
  head.innerHTML = "";
  body.innerHTML = "";

  // header row
  const thRow = document.createElement("tr");
  fields.forEach((f) => {
    const th = document.createElement("th");
    th.textContent = f;
    thRow.appendChild(th);
  });
  head.appendChild(thRow);

  // data rows
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    fields.forEach((f) => {
      const td = document.createElement("td");
      td.textContent = r[f] !== null ? r[f] : "";
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });

  document.getElementById("queryResult").style.display = "block";
}

async function askAI() {
  const question = document.getElementById("question").value;
  const answerElem = document.getElementById("answer");

  answerElem.innerText = "";

  try {
    const res = await fetch("http://localhost:3000/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    if (res.ok) {
      answerElem.innerText = data.answer || "(no answer)";
    } else {
      answerElem.innerText = data.error || "AI request failed";
    }
  } catch (err) {
    console.error("askAI error", err);
    answerElem.innerText = "Connection error";
  }
}

// Check if user is logged in when page loads
document.addEventListener("DOMContentLoaded", async function () {
  if (window.location.pathname.includes("dashboard")) {
    const loggedIn = await checkSession();
    if (!loggedIn) {
      window.location.href = "index.html";
    }
  }
});