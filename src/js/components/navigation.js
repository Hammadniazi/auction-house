const nav = document.getElementById("main-nav");

export function renderNavigartion() {
  const isLoggedIn = localStorage.getItem("token") !== null;

  nav.innerHTML = `
<nav class="bg-white dark:bg-gray-800 shadow-lg sticky top-0 transition-colors z-50">
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
    </div>

`;
}
