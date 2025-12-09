import { isAuthenticated, getUser, logout } from "../utils/auth.js";
import { profileAPI } from "../api/api.js";
import { renderDarkModeToggle } from "./darkmode.js";

export function renderNavigation() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  // Add classes to the nav element
  nav.className = "bg-white dark:bg-gray-800 shadow-lg transition-colors";

  const isLoggedIn = isAuthenticated();

  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a href="/index.html" class="flex items-center">
              <i class="fas fa-gavel text-2xl text-primary-600 dark:text-primary-400 mr-2"></i>
              <span class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Auction House</span>
            </a>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-2 lg:space-x-4">
            <a href="/index.html" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition">
              Home
            </a>
            
            ${
              isLoggedIn
                ? `
              <a href="/pages/create-listing.html" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition">
                Create Listing
              </a>
              <a href="/pages/profile.html" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition">
                Profile
              </a>
              <div class="hidden lg:flex items-center bg-primary-50 dark:bg-primary-900/30 px-3 py-2 rounded-lg">
                <i class="fas fa-coins text-lg text-primary-600 dark:text-primary-400 mr-2"></i>
                <span class="text-primary-900 dark:text-primary-100 font-semibold text-sm" id="user-credits">Loading...</span>
              </div>
              <div id="dark-mode-toggle-container"></div>
              <button id="logout-btn" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                Logout
              </button>
            `
                : `
              <a href="/pages/login.html" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition">
                Login
              </a>
              <a href="/pages/register.html" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition">
                Register
              </a>
              <div id="dark-mode-toggle-container"></div>
            `
            }
          </div>
          <!-- Mobile menu button -->
          <div class="flex md:hidden items-center space-x-2">
            <div id="dark-mode-toggle-container-mobile"></div>
            <button id="mobile-menu-btn" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <!-- Hamburger icon -->
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu (hidden by default) -->
      <div id="mobile-menu" class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="/index.html" class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition">
            Home
          </a>
          
          ${
            isLoggedIn
              ? `
            <a href="/pages/create-listing.html" class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition">
              Create Listing
            </a>
            <a href="/pages/profile.html" class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition">
              Profile
            </a>
            <div class="flex items-center bg-primary-50 dark:bg-primary-900/30 px-3 py-2 rounded-md mx-3 my-2">
              <i class="fas fa-coins text-lg text-primary-600 dark:text-primary-400 mr-2"></i>
              <span class="text-primary-900 dark:text-primary-100 font-semibold" id="user-credits-mobile">Loading...</span>
            </div>
            <button id="logout-btn-mobile" class="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition mx-3">
              Logout
            </button>
          `
              : `
            <a href="/pages/login.html" class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition">
              Login
            </a>
            <a href="/pages/register.html" class="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition">
              Register
            </a>
          `
          }
        </div>
      </div>
    </div>
`;

  //  Add logout event listener

  if (isLoggedIn) {
    const logoutBtn = document.getElementById("logout-btn");
    const logoutBtnMobile = document.getElementById("logout-btn-mobile");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logout();
      });
    }

    if (logoutBtnMobile) {
      const logoutBtnMobile = document.getElementById("logout-btn-mobile");
      logoutBtnMobile.addEventListener("click", () => {
        logout();
      });
    }
    // Load and display user credits
    updateUserCredits();
  }

  // Mobile menu toggle functionality
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      const icon = mobileMenuBtn.querySelector("i");

      if (isExpanded) {
        // Close menu
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      } else {
        // Open menu
        mobileMenu.classList.remove("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "true");
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      }
    });
  }

  // Render dark mode toggle buttons
  renderDarkModeToggle("dark-mode-toggle-container");
  renderDarkModeToggle("dark-mode-toggle-container-mobile");
}

//  Update user credits in the navigation

export async function updateUserCredits() {
  const creditsElement = document.getElementById("user-credits");
  const creditsElementMobile = document.getElementById("user-credits-mobile");

  try {
    const user = getUser();
    if (user && user.name) {
      const profileData = await profileAPI.getProfile(user.name);
      const credits = profileData.data?.credits ?? 0;
      const creditsText = `${credits} Credits`;
      if (creditsElement) {
        creditsElement.textContent = creditsText;
      }
      if (creditsElementMobile) {
        creditsElementMobile.textContent = creditsText;
      }
      // Update user in local storage with latest credits
      const updatedUser = { ...user, credits };
      localStorage.setItem("auction_user", JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error("Error fetching credits:", error);
    if (creditsElement) {
      creditsElement.textContent = "0 Credits";
    }
    if (creditsElementMobile) {
      creditsElementMobile.textContent = "0 Credits";
    }
  }
}
