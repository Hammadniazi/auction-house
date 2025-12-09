import { renderNavigation } from "../components/navigation.js";
import { authAPI } from "../api/api.js";
import { isAuthenticated } from "../utils/auth.js";
import { showSuccess, validateEmail } from "../utils/helpers.js";
import {
  showError,
  clearMessages,
  showLoading,
  hideLoading,
} from "../utils/helpers.js";
import { renderFooter } from "../components/footer.js";
import { initDarkMode } from "../components/darkmode.js";

// Initialize dark mode
initDarkMode();

// Redirect if already logged in
if (isAuthenticated()) {
  window.location.href = "/index.html";
}

// Initialize navigation
renderNavigation();
// Initialize footer
renderFooter();

// Register form handling

const registerForm = document.getElementById("register-form");
const submitBtn = document.getElementById("submit-btn");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  if (!name) {
    showError("Name is required");
    return;
  }

  if (!email) {
    showError("Email is required");
  }

  //   Email Validation
  if (!validateEmail(email)) {
    showError("Email must end with @stud.noroff.no");
    return;
  }
  // Validate password match
  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  // Validate password length

  if (password.length < 8) {
    showError("Password must be at least 8 characters long");
    return;
  }

  try {
    showLoading(submitBtn, "Registering...");
    await authAPI.register({
      name,
      email,
      password,
    });

    showSuccess("Account created successfully! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/pages/login.html";
    }, 2000);
  } catch (error) {
    showError(error.message) || "Registration failed. Please try again.";
  } finally {
    hideLoading(submitBtn);
  }
});
