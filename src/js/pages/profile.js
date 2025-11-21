import { renderNavigation, updateUserCredits } from "../components/navigation";
import { requireAuth, getUser, setUser } from "../utils/auth.js";
import { profileAPI } from "../api/api.js";

if (!requireAuth()) {
  throw new Error("Authentication required!");
}

renderNavigation();

// State

let userProfile = null;

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

// Initial load
loadProfile();
