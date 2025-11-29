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
} from "../utils/helpers.js";
import { createListingCard } from "../components/listings.js";
import { renderFooter } from "../components/footer.js";

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
    }
  });

// Initial load
loadProfile();
loadUserListings();
