// Dark mode toggle functionality

export function initDarkMode() {
  // Load saved theme or default to dark mode
  if (localStorage.theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    // Default to dark mode (either explicitly saved as dark or no preference set)
    document.documentElement.classList.add("dark");
  }
}

export function renderDarkModeToggle(
  containerId = "dark-mode-toggle-container",
) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  const isDark = document.documentElement.classList.contains("dark");
  const buttonId = `theme-toggle-${containerId}`;

  container.innerHTML = `
    <button
      id="${buttonId}"
      class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      <i class="fas ${isDark ? "fa-sun" : "fa-moon"}"></i>
    </button>
  `;

  const themeToggle = document.getElementById(buttonId);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");

      // Update all toggle icons (desktop and mobile)
      document.querySelectorAll('[id^="theme-toggle-"] i').forEach((icon) => {
        const isDark = document.documentElement.classList.contains("dark");
        icon.className = `fas ${isDark ? "fa-sun" : "fa-moon"}`;
      });

      // Save preference
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}
