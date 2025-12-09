import { renderNavigation } from "../components/navigation";
import { requireAuth } from "../utils/auth.js";
import { listingAPI } from "../api/api.js";
import {
  showError,
  showSuccess,
  clearMessages,
  showLoading,
  hideLoading,
} from "../utils/helpers";
import { renderFooter } from "../components/footer.js";
import { initDarkMode } from "../components/darkmode.js";

// Initialize dark mode
initDarkMode();

//  Require authentication
if (!requireAuth()) {
  throw new Error("Authentication required");
}
// Initialize navigation
renderNavigation();

// Initialize footer
renderFooter();

// Set minimun date to current date/time
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById("endsAt").min = now.toISOString().slice(0, 16);

//  Media gallery handling

let mediaCount = 0;
const maxMedia = 8;

document.getElementById("add-media-btn").addEventListener("click", () => {
  if (mediaCount >= maxMedia) {
    showError(`Maximum ${maxMedia} images allowed`);
    return;
  }

  const mediaContainer = document.getElementById("media-container");
  const mediaItem = document.createElement("div");
  mediaItem.className = "media-item flex space-x-2";

  mediaItem.innerHTML = `
    <input 
      type="url" 
      name="media-url-${mediaCount}" 
      class="input-field flex-1"
      placeholder="Image URL"
    >
    <input 
      type="text" 
      name="media-alt-${mediaCount}" 
      class="input-field flex-1"
      placeholder="Alt text (optional)"
    >
    <button type="button" class="remove-media-btn text-red-600 hover:text-red-700 px-3">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  `;
  mediaContainer.appendChild(mediaItem);
  mediaCount++;

  //   Add remove handler

  mediaItem.querySelector(".remove-media-btn").addEventListener("click", () => {
    mediaItem.remove();
    mediaCount--;
  });
});

// Handle form submission

const createListingForm = document.getElementById("create-listing-form");
createListingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearMessages();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const endsAt = document.getElementById("endsAt").value;
  const tagsInput = document.getElementById("tags").value.trim();

  // Validate end Date

  const endDate = new Date(endsAt);
  const currentDate = new Date();
  if (endDate <= currentDate) {
    showError("Auction end date must be in the future.");
    return;
  }
  //  Collect media
  const media = [];
  const mediaItems = document.querySelectorAll(".media-item");
  mediaItems.forEach((item, index) => {
    const url = item.querySelector(`[name="media-url-${index}"]`).value.trim();
    const alt = item.querySelector(`[name="media-alt-${index}"]`).value.trim();

    if (url) {
      media.push({ url, alt: alt || title });
    }
  });

  // Parse tags

  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];
  const listingData = {
    title,
    description,
    endsAt: endDate.toISOString(),
    media: media.length > 0 ? media : undefined,
    tags: tags.length > 0 ? tags : undefined,
  };

  const submitBtn = document.getElementById("submit-btn");
  try {
    showLoading(submitBtn, "Creating...");
    const response = await listingAPI.createListing(listingData);
    showSuccess("Listing created successfully! Redirecting...");
    setTimeout(() => {
      window.location.href = `/pages/listing.html?id=${response.data.id}`;
    }, 1500);
  } catch (error) {
    showError(error.message) || "Failed to create listing. Please try again.";
  } finally {
    hideLoading(submitBtn);
  }
});
