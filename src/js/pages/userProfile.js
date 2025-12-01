import { renderNavigation } from "../components/navigation";
import { renderFooter } from "../components/footer.js";
import { profileAPI } from "../api/api.js";
import { createListingCard } from "../components/listings";
import { showError, clearMessages } from "../utils/helpers";
import { isAuthenticated } from "../utils/auth.js";

// Check if user is logged in
if (!isAuthenticated()) {
  //   alert("Please log in first to view user profiles.");
  throw (
    new Error("Authentication required"),
    (window.location.href = "/pages/login.html")
  );
}

// Initialize navigation
renderNavigation();
// Initialize footer
renderFooter();
//  get username from URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
if (!username) {
  showError("No user specified.");
  document.getElementById("user-name").textContent = "User not found";
} else {
  loadUserProfile(username);
}
let userProfile = null;
let userListings = [];
let userWins = [];
//  Load user profile
async function loadUserProfile(username) {
  clearMessages();

  try {
    const response = await profileAPI.getProfile(username);
    userProfile = response.data;
    displayProfileInfo();
    await loadUserListings(username);
    await loadUserWins(username);
  } catch (error) {
    console.error("Error loading user profile:", error);
    showError("Failed to load user profile. User may not exist.");
    document.getElementById("user-name").textContent = "User not found";
  }
}
//  Display profile information
function displayProfileInfo() {
  document.getElementById("user-name").textContent = userProfile.name;
  document.getElementById("user-email").textContent = userProfile.email;
  document.getElementById("user-bio").textContent =
    userProfile.bio || "No bio yet";

  // include `credits` for other users, show "Private" instead of 0
  const creditsEl = document.getElementById("profile-user-credits");
  const creditsValue =
    userProfile.credits !== undefined && userProfile.credits !== null
      ? userProfile.credits
      : null;

  creditsEl.textContent = creditsValue !== null ? `${creditsValue}` : "Private";

  // Avatar
  const avatarImg = document.getElementById("avatar-img");
  const avatarPlaceholder = document.getElementById("avatar-placeholder");

  if (userProfile.avatar && userProfile.avatar.url) {
    avatarImg.src = userProfile.avatar.url;
    avatarImg.alt = userProfile.avatar.alt || userProfile.name;
    avatarImg.classList.remove("hidden");
    avatarPlaceholder.classList.add("hidden");
  }

  // Banner
  const bannerImg = document.getElementById("banner-img");
  const bannerPlaceholder = document.getElementById("banner-placeholder");

  if (userProfile.banner && userProfile.banner.url) {
    bannerImg.src = userProfile.banner.url;
    bannerImg.alt = userProfile.banner.alt || "Profile Banner";
    bannerImg.classList.remove("hidden");
    bannerPlaceholder.classList.add("hidden");
  }
}

// Load user's listings
async function loadUserListings(username) {
  try {
    const response = await profileAPI.getProfileListings(username);
    userListings = response.data || [];

    // Update count
    document.getElementById("listings-count").textContent = userListings.length;

    // Render listings
    renderUserListings();
  } catch (error) {
    console.error("Error loading user listings:", error);
    document.getElementById("user-listings-container").innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No listings found</p>
      </div>
    `;
  }
}

// Load user's wins (completed bids where they won)
async function loadUserWins(username) {
  try {
    const response = await profileAPI.getProfileBids(username);
    const allBids = response.data || [];

    // Filter for wins: bids where the auction ended and this user has the highest bid
    userWins = allBids.filter((bid) => {
      const listing = bid.listing;
      if (!listing) return false;

      const isExpired = new Date(listing.endsAt) < new Date();
      if (!isExpired) return false;

      // Check if this bid is the highest
      if (
        !listing.bids ||
        !Array.isArray(listing.bids) ||
        listing.bids.length === 0
      ) {
        return false;
      }

      const highestBid = Math.max(...listing.bids.map((b) => b.amount));
      return bid.amount === highestBid;
    });

    // Update count
    document.getElementById("wins-count").textContent = userWins.length;

    // Render wins
    renderUserWins();
  } catch (error) {
    console.error("Error loading user wins:", error);
    document.getElementById("user-wins-container").innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No wins found</p>
      </div>
    `;
  }
}
// Render user listings
function renderUserListings() {
  const container = document.getElementById("user-listings-container");

  if (userListings.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-box-open text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">No active listings</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userListings
    .map((listing) => createListingCard(listing))
    .join("");
}

// Render user wins
function renderUserWins() {
  const container = document.getElementById("user-wins-container");

  if (userWins.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-trophy text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">No auction wins yet</p>
      </div>
    `;
    return;
  }

  // Render the listings that were won
  container.innerHTML = userWins
    .map((bid) => createListingCard(bid.listing))
    .join("");
}

// Tab switching
const listingsTab = document.getElementById("listings-tab");
const winsTab = document.getElementById("wins-tab");
const listingsContent = document.getElementById("listings-content");
const winsContent = document.getElementById("wins-content");

listingsTab.addEventListener("click", () => {
  // Update tab styles
  listingsTab.classList.remove(
    "border-transparent",
    "text-gray-500",
    "dark:text-gray-400",
  );
  listingsTab.classList.add(
    "border-primary-500",
    "text-primary-600",
    "dark:text-primary-400",
  );

  winsTab.classList.add(
    "border-transparent",
    "text-gray-500",
    "dark:text-gray-400",
  );
  winsTab.classList.remove(
    "border-primary-500",
    "text-primary-600",
    "dark:text-primary-400",
  );

  // Show/hide content
  listingsContent.classList.remove("hidden");
  winsContent.classList.add("hidden");
});

winsTab.addEventListener("click", () => {
  // Update tab styles
  winsTab.classList.remove(
    "border-transparent",
    "text-gray-500",
    "dark:text-gray-400",
  );
  winsTab.classList.add(
    "border-primary-500",
    "text-primary-600",
    "dark:text-primary-400",
  );

  listingsTab.classList.add(
    "border-transparent",
    "text-gray-500",
    "dark:text-gray-400",
  );
  listingsTab.classList.remove(
    "border-primary-500",
    "text-primary-600",
    "dark:text-primary-400",
  );
  // Show/hide content
  winsContent.classList.remove("hidden");
  listingsContent.classList.add("hidden");
});
