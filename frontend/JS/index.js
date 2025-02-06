
//CESSTIG/FRONTEND/JS/index.js
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginButton = document.querySelector("#loginForm button[type='submit']");
    const errorMessage = document.getElementById("errorMessage");

    // Reset error message
    errorMessage.textContent = "";

    // Basic form validation
    if (!role || !email || !password) {
        errorMessage.textContent = "Please fill in all fields.";
        return;
    }

    // Disable button and show loading state
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Logging in...';

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, email, password }) // Include role in request
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user)); // Store user info

            // Redirect based on role
            if (data.user.role === "Student") {
                window.location.href = "student-dashboard.html";
            } else if (data.user.role === "Lecturer") {
                window.location.href = "lecturer-dashboard.html";
            } else if (data.user.role === "Admin") {
                window.location.href = "admin-dashboard.html";
            }
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
    } finally {
        // Re-enable button
        loginButton.disabled = false;
        loginButton.innerHTML = "Login";
    }
});

// Password visibility toggle
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword").querySelector("i");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("bi-eye");
        toggleIcon.classList.add("bi-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("bi-eye-slash");
        toggleIcon.classList.add("bi-eye");
    }
});
