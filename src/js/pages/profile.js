import {
  renderNavigation,
  updateUserCredits,
} from "../components/navigation.js";
import { requireAuth, getUser, setUser } from "../utils/auth.js";
import { profileAPI } from "../api/api.js";
import {
  clearMessages,
  showError,
  showLoading,
  showSuccess,
  hideLoading,
} from "../utils/helpers.js";
import { createListingCard } from "../components/listings.js";
import { renderFooter } from "../components/footer.js";
import { getHighestBid, formatTimeRemaining } from "../utils/helpers.js";

// Require authentication
if (!requireAuth()) {
  throw new Error("Authentication required!");
}
//  Initiate Navigation
renderNavigation();
// Initialize footer
renderFooter();

// State

let userProfile = null;
let userListings = [];
let userBids = [];

//  Load user profile

async function loadProfile() {
  const user = getUser();
  if (!user) return;
  try {
    const response = await profileAPI.getProfile(user.name);
    userProfile = response.data;

    // Update UI
    document.getElementById("profile-name").textContent = userProfile.name;
    document.getElementById("profile-email").textContent = userProfile.email;
    document.getElementById("profile-bio").textContent =
      userProfile.bio || "No bio available.";
    document.getElementById("profile-credits").textContent =
      userProfile.credits || 0;

    // Update avatar
    const avatarImg = document.getElementById("avatar-img");
    const avatarPlaceholder = document.getElementById("avatar-placeholder");
    if (userProfile.avatar && userProfile.avatar.url) {
      avatarImg.src = userProfile.avatar.url;
      avatarImg.alt = userProfile.avatar.alt || userProfile.name;
      avatarImg.classList.remove("hidden");
      if (avatarPlaceholder) {
        avatarPlaceholder.classList.add("hidden");
      }
    }
    // Update banner
    if (userProfile.banner && userProfile.banner.url) {
      const bannerImg = document.getElementById("banner-img");
      bannerImg.src = userProfile.banner.url;
      bannerImg.alt = userProfile.banner.alt || "Profile Banner";
      bannerImg.classList.remove("hidden");
    }

    //  Show edit buttons
    document.getElementById("edit-profile-btn").classList.remove("hidden");
    document.getElementById("edit-avatar-btn").classList.remove("hidden");
    document.getElementById("edit-banner-btn").classList.remove("hidden");

    //  Update stored user data
    setUser({
      ...user,
      avatar: userProfile.avatar,
      banner: userProfile.banner,
      credits: userProfile.credits,
      bio: userProfile.bio,
    });

    // Update user credits
    updateUserCredits();
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// Load user listings
async function loadUserListings() {
  const user = getUser();
  if (!user) return;
  try {
    const response = await profileAPI.getProfileListings(user.name);
    userListings = response.data || [];
    renderUserListings();
  } catch (error) {
    console.error("Error loading listings:", error);
    document.getElementById("my-listings-container").innerHTML = `
     <div class="col-span-full text-center py-12 text-gray-500">
        Failed to load listings
      </div>
        `;
  }
}

//    Render user listings

function renderUserListings() {
  const container = document.getElementById("my-listings-container");
  if (userListings.length === 0) {
    container.innerHtml = `
        <div class="col-span-full text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No listings yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new listing</p>
        <div class="mt-6">
          <a href="/pages/create-listing.html" class="btn-primary">
            Create Listing
          </a>
        </div>
      </div>
      `;
    return;
  }
  container.innerHTML = userListings
    .map((listing) => createListingCard(listing))
    .join("");
}

//  Modal handling

const modal = document.getElementById("edit-modal");
const editProfileBtn = document.getElementById("edit-profile-btn");
const editAvatarBtn = document.getElementById("edit-avatar-btn");
const editBannerBtn = document.getElementById("edit-banner-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");

function openModal() {
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (userProfile) {
    document.getElementById("bio").value = userProfile.bio || "";
    document.getElementById("avatar-url").value = userProfile.avatar?.url || "";
    document.getElementById("avatar-alt").value = userProfile.avatar?.alt || "";
    document.getElementById("banner-url").value = userProfile.banner?.url || "";
    document.getElementById("banner-alt").value = userProfile.banner?.alt || "";
  }
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  clearMessages("modal-error-container");
}

editProfileBtn.addEventListener("click", openModal);
editAvatarBtn.addEventListener("click", openModal);
editBannerBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Handle profile update
document
  .getElementById("edit-profile-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages("modal-error-container");

    const bio = document.getElementById("bio").value;
    const avatarUrl = document.getElementById("avatar-url").value;
    const avatarAlt = document.getElementById("avatar-alt").value;
    const bannerUrl = document.getElementById("banner-url").value;
    const bannerAlt = document.getElementById("banner-alt").value;

    const updateData = {
      bio: bio || undefined,
      avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt || "" } : undefined,
      banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt || "" } : undefined,
    };

    const saveBtn = document.getElementById("save-profile-btn");

    try {
      showLoading(saveBtn, "Saving...");
      const user = getUser();
      await profileAPI.updateProfile(user.name, updateData);
      showSuccess("Profile updated successfully!", "model-error-container");
      setTimeout(async () => {
        closeModal();
        await loadProfile();
      }, 1500);
    } catch (error) {
      showError(
        error.message || "Failed to update profile.",
        "modal-error-container",
      );
    } finally {
      hideLoading(saveBtn);
    }
  });

//  Load user bids
async function loadUserBids() {
  const user = getUser();
  if (!user) return;

  try {
    const response = await profileAPI.getProfileBids(user.name);
    userBids = response.data || [];
    renderUserBids();
  } catch (error) {
    console.error("Error loading bids:", error);
    document.getElementById("my-bids-container").innerHTML = `

    <div class="col-span-full text-center py-12 text-gray-500">
        Failed to load bids
      </div>
        
        `;
  }
}

//  Render user bids

function renderUserBids() {
  const container = document.getElementById("my-bids-container");

  if (userBids.length === 0) {
    container.innerHTML = `

     <div class="col-span-full text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No bids yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start bidding on listings to see them here</p>
        <div class="mt-6">
          <a href="/index.html" class="btn-primary">
            Browse Listings
          </a>
        </div>
      </div>
        `;
    return;
  }
  container.innerHTML = userBids
    .map((bid) => {
      const listing = bid.listing;
      if (!listing) return "";

      const highestBid = getHighestBid(listing.bids);
      const isWinning = bid.amount >= highestBid;
      const imageUrl = listing.media?.[0]?.url || "";

      return `
    <div class="card cursor-pointer" onclick="window.location.href='/pages/listing.html?id=${
      listing.id
    }'">
        <div class="relative">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${listing.title}" class="w-full h-48 object-cover" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">`
              : ""
          }
          <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 ${
            imageUrl ? "hidden" : "flex"
          } items-center justify-center">
            <div class="text-center">
              <i class="fas fa-image text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
              <p class="text-sm text-gray-500 dark:text-gray-400">No Image</p>
            </div>
          </div>
          ${
            isWinning
              ? '<div class="absolute top-2 right-2 badge-success">Winning</div>'
              : '<div class="absolute top-2 right-2 badge-danger">Outbid</div>'
          }
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">${
            listing.title
          }</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Your Bid:</span>
              <span class="text-lg font-bold text-primary-600 dark:text-primary-400">${
                bid.amount
              } Credits</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">Highest Bid:</span>
              <span class="text-lg font-bold ${
                isWinning ? "text-green-600" : "text-red-600"
              }">${highestBid} Credits</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Time Left:</span>
              <span class="text-sm font-semibold">${formatTimeRemaining(
                listing.endsAt,
              )}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// Tab switching

document.getElementById("tab-listings").addEventListener("click", () => {
  document
    .getElementById("tab-listings")
    .classList.add("active", "border-primary-600", "text-primary-600");
  document
    .getElementById("tab-listings")
    .classList.remove("text-gray-500", "border-transparent");
  document
    .getElementById("tab-bids")
    .classList.remove("active", "border-primary-600", "text-primary-600");
  document
    .getElementById("tab-bids")
    .classList.add("text-gray-500", "border-transparent");

  document.getElementById("listings-section").classList.remove("hidden");
  document.getElementById("bids-section").classList.add("hidden");
});

document.getElementById("tab-bids").addEventListener("click", () => {
  document
    .getElementById("tab-bids")
    .classList.add("active", "border-primary-600", "text-primary-600");
  document
    .getElementById("tab-bids")
    .classList.remove("text-gray-500", "border-transparent");
  document
    .getElementById("tab-listings")
    .classList.remove("active", "border-primary-600", "text-primary-600");
  document
    .getElementById("tab-listings")
    .classList.add("text-gray-500", "border-transparent");
  document.getElementById("bids-section").classList.remove("hidden");
  document.getElementById("listings-section").classList.add("hidden");

  if (userBids.length === 0) {
    loadUserBids();
  }
});

// Initial load
loadProfile();
loadUserListings();
