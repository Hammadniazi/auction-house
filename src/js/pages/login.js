import { renderNavigartion } from "../components/navigation";
import { authAPI } from "../api/api.js";
import { setToken, setUser } from "../utils/auth.js";
import { validateEmail } from "../utils/helpers.js";
import { showError } from "../utils/helpers.js";

renderNavigartion();

/* if (isAuthenticated()) {
  window.location.href = "/index.html";
} */

const loginForm = document.getElementById("login-form");
// const submitBtn = document.getElementById("submit-btn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!validateEmail(email)) {
    showError("Email must be end with @stud.noroff.no");
    return;
  }
  try {
    // showLoading(submitBtn, "Signing In...");

    const response = await authAPI.login({ email, password });
    if (response.data) {
      setToken(response.data.accessToken);
      setUser({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        banner: response.data.banner,
        credits: response.data.credits || 1000,
      });

      window.location.href = "/index.html";
    }
  } catch (error) {
    // hideLoading(submitBtn);
    showError(error.message || "Login failed. Please check your credentials.");
  }
});
