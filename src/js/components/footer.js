export function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
  <footer class="bg-gray-800 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <!-- About Section -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <i class="fas fa-gavel text-2xl text-primary-400 dark:text-primary-500"></i>
            <span class="text-xl font-bold text-white dark:text-white">Auction House</span>
          </div>
          <p class="text-sm text-gray-300 dark:text-gray-400">
            Your trusted platform for online auctions. Place bids, create listings, and discover amazing items.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white dark:text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/" class="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors">
                Browse Listings
              </a>
            </li>
            <li>
              <a href="/pages/create-listing.html" class="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors">
                Create Listing
              </a>
            </li>
            <li>
              <a href="/pages/profile.html" class="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors">
                My Profile
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-white dark:text-white font-semibold mb-4">Contact</h3>
          <div class="space-y-2 text-sm">
            <p class="text-gray-300 dark:text-gray-400">
              For @stud.noroff.no users only
            </p>
            <p class="text-gray-300 dark:text-gray-400">
              Built for Noroff Front-End Development
            </p>
            <p class="text-gray-300 dark:text-gray-400">
              Oslo, Norway
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-gray-700 dark:border-gray-800 text-center text-sm">
        <p class="text-gray-400 dark:text-gray-500">&copy; ${currentYear} Auction House. All rights reserved.</p>
      </div>
    </div>
  </footer>
  `;
}
