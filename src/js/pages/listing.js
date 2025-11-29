import {
  renderNavigation,
  updateUserCredits,
} from "../components/navigation.js";
import { listingAPI, bidsAPI } from "../api/api.js";
import {
  showError,
  showSuccess,
  clearMessages,
  showLoading,
  hideLoading,
} from "../utils/helpers.js";
import { getUser, isAuthenticated } from "../utils/auth.js";
import {
  formatDate,
  getHighestBid,
  getTimeRemaining,
  formatTimeRemaining,
} from "../utils/helpers.js";
import { renderFooter } from "../components/footer.js";

//  Initialize Navigation
renderNavigation();
// Initialize footer
renderFooter();

//  Get listings ID from URL
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

if (!listingId) {
  window.location.href = "/index.html";
}
let currentListing = null;
let currentUser = null;

// Load listing

async function loadlisting() {
  try {
    const response = await listingAPI.getListing(listingId);
    currentListing = response.data;
    currentUser = getUser();
    renderListing();
  } catch (error) {
    console.error("Error loading listing:", error);
    showError("Failed to load listing details.");
    document.getElementById("listing-container").innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-600">Failed to load listing</p>
        <a href="/index.html" class="btn-primary mt-4 inline-block">Back to Listings</a>
      </div>
    `;
  }
}

// Render listing
function renderListing() {
  const container = document.getElementById("listing-container");
  const highestBid = getHighestBid(currentListing.bids);
  const timeInfo = getTimeRemaining(currentListing.endsAt);
  const isOwner =
    currentUser && currentListing.seller?.name === currentUser.name;
  const canBid = isAuthenticated() && !isOwner && !timeInfo.isExpired;

  //    Image gallery

  const images =
    currentListing.media && currentListing.media.length > 0
      ? currentListing.media
      : [];
  const hasImages = images.length > 0;
  container.innerHTML = `
   <!-- Image Gallery -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        ${
          hasImages
            ? `
        <img id="main-image" src="${images[0].url}" alt="${
          images[0].alt || currentListing.title
        }" class="w-full h-96 object-cover" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 hidden items-center justify-center">
          <div class="text-center">
            <i class="fas fa-image text-6xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p class="text-lg text-gray-500 dark:text-gray-400">Image not available</p>
          </div>
        </div>
        `
            : `
        <div class="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div class="text-center">
            <i class="fas fa-image text-6xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p class="text-lg text-gray-500 dark:text-gray-400">No Image Available</p>
          </div>
        </div>
        `
        }
        ${
          images.length > 1
            ? `
          <div class="p-4 grid grid-cols-4 gap-2">
            ${images
              .map(
                (img, index) => `
              <div class="relative">
                <img src="${img.url}" alt="${img.alt || currentListing.title}" 
                   class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition ${
                     index === 0 ? "ring-2 ring-primary-600" : ""
                   }"
                   onclick="document.getElementById('main-image').src='${
                     img.url
                   }'; 
                            document.querySelectorAll('.h-20').forEach(el => el.parentElement.classList.remove('ring-2', 'ring-primary-600'));
                            this.parentElement.classList.add('ring-2', 'ring-primary-600');"
                   onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="absolute inset-0 bg-gray-300 dark:bg-gray-600 hidden items-center justify-center rounded">
                  <i class="fas fa-image text-gray-500 dark:text-gray-400"></i>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>

      <!-- Description -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${
          currentListing.description || "No description provided"
        }</p>
        
        ${
          currentListing.tags && currentListing.tags.length > 0
            ? `
          <div class="mt-4">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Tags:</h3>
            <div class="flex flex-wrap gap-2">
              ${currentListing.tags
                .map(
                  (tag) => `
                <span class="badge-info">${tag}</span>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
       <!-- Bid History -->
       <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bid History</h2>
        <div id="bids-container">
          ${renderBidHistory()}
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
        <div class="mb-6">
          ${
            timeInfo.isExpired
              ? '<span class="badge-danger text-lg">Auction Ended</span>'
              : '<span class="badge-success text-lg">Active</span>'
          }
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">${
          currentListing.title
        }</h1>

        <div class="space-y-4 mb-6">
          <div>
            <p class="text-sm text-gray-500">Current Bid</p>
            <p class="text-4xl font-bold text-primary-600">${highestBid} Credits</p>
            <p class="text-sm text-gray-500 mt-1">${
              currentListing._count?.bids || 0
            } bids</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Time Remaining</p>
            <p class="text-xl font-semibold ${
              timeInfo.isExpired ? "text-red-600" : "text-gray-800"
            }" id="time-remaining">
              ${formatTimeRemaining(currentListing.endsAt)}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Ends At</p>
            <p class="text-sm text-gray-800">${formatDate(
              currentListing.endsAt,
            )}</p>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-500">Seller</p>
            <p class="text-lg font-semibold text-gray-800">${
              currentListing.seller?.name || "Unknown"
            }</p>
          </div>
        </div>

        ${
          canBid
            ? `
          <form id="bid-form" class="space-y-4">
            <div>
              <label for="bid-amount" class="block text-sm font-medium text-gray-700 mb-2">
                Your Bid (Credits)
              </label>
              <input 
                type="number" 
                id="bid-amount" 
                min="${highestBid + 1}" 
                step="1" 
                required 
                class="input-field"
                placeholder="${highestBid + 1}"
              >
              <p class="text-xs text-gray-500 mt-1">Minimum bid: ${
                highestBid + 1
              } Credits</p>
            </div>
            <button type="submit" id="bid-btn" class="w-full btn-primary">
              Place Bid
            </button>
          </form>
        `
            : isOwner
              ? `
          <div class="space-y-3">
            <button id="edit-listing-btn" class="w-full btn-primary">
              Edit Listing
            </button>
            <button id="delete-listing-btn" class="w-full btn-danger">
              Delete Listing
            </button>
          </div>
        `
              : !isAuthenticated()
                ? `
          <div class="text-center">
            <p class="text-gray-600 mb-4">Please log in to place a bid</p>
            <a href="/pages/login.html" class="btn-primary inline-block">Log In</a>
          </div>
        `
                : timeInfo.isExpired
                  ? `
          <div class="text-center p-4 bg-gray-100 rounded-lg">
            <p class="text-gray-700 font-semibold">This auction has ended</p>
          </div>
        `
                  : ""
        }
      </div>
    </div>

       
       `;

  // Add event listeners
  if (canBid) {
    document
      .getElementById("bid-form")
      .addEventListener("submit", handleBidSubmit);
    //  Update time remaining every second
    setInterval(updateTimeRemaining, 1000);
  }
  if (isOwner) {
    document
      .getElementById("edit-listing-btn")
      .addEventListener("click", openEditModal);
    document
      .getElementById("delete-listing-btn")
      .addEventListener("click", openDeleteModal);
  }
}

//  Render bid history
function renderBidHistory() {
  if (!currentListing.bids || currentListing.bids.length === 0) {
    return `
      <div class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No bids yet</p>
        <p class="text-sm">Be the first to bid!</p>
      </div>
        `;
  }

  const sortedBids = [...currentListing.bids].sort(
    (a, b) => b.amount - a.amount,
  );
  return `
  <div class="space-y-3 max-h-96 overflow-y-auto">
      ${sortedBids
        .map(
          (bid, index) => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg ${
          index === 0 ? "ring-2 ring-primary-300" : ""
        }">
          <div>
            <p class="font-semibold text-gray-800">${
              bid.bidder?.name || "Anonymous"
            }</p>
            <p class="text-xs text-gray-500">${formatDate(bid.created)}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-primary-600">${
              bid.amount
            } Credits</p>
            ${
              index === 0
                ? '<span class="text-xs badge-success">Highest Bid</span>'
                : ""
            }
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
    `;
}

//  Update time remaining
function updateTimeRemaining() {
  const timeElement = document.getElementById("time-remaining");
  if (timeElement && currentListing) {
    timeElement.textContent = formatTimeRemaining(currentListing.endsAt);
    if (getTimeRemaining(currentListing.endsAt).isExpired) {
      timeElement.classList.add("text-red-600");
      timeElement.classList.remove("text-gray-800");
    }
  }
}
//  Handle bid submission

async function handleBidSubmit(e) {
  e.preventDefault();
  clearMessages();

  const bidAmount = parseInt(document.getElementById("bid-amount").value);
  const highestBid = getHighestBid(currentListing.bids);

  if (bidAmount <= highestBid) {
    showError(`Your bid must be higher than ${highestBid} Credits`);
    return;
  }
  const bidBtn = document.getElementById("bid-btn");
  try {
    showLoading(bidBtn, "Placing bid...");
    await bidsAPI.placeBid(listingId, bidAmount);
    showSuccess("Bid placed successfully!");

    // Reload listing to show updated bids
    setTimeout(async () => {
      await loadlisting();
      await updateUserCredits();
    }, 1000);
  } catch (error) {
    hideLoading(bidBtn);
    showError(error.message || "Failed to place bid. Please try again.");
  }
}

// Edit modal handling
function openEditModal() {
  document.getElementById("edit-title").value = currentListing.title;
  document.getElementById("edit-description").value =
    currentListing.description || "";
  document.getElementById("edit-modal").classList.remove("hidden");
  document.getElementById("edit-modal").classList.add("flex");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("edit-modal").classList.remove("flex");
  clearMessages("modal-error-container");
}
document
  .getElementById("close-edit-modal-btn")
  .addEventListener("click", closeEditModal);
document
  .getElementById("cancel-edit-btn")
  .addEventListener("click", closeEditModal);
document
  .getElementById("edit-listing-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages("modal-error-container");

    const title = document.getElementById("edit-title").value.trim();
    const description = document
      .getElementById("edit-description")
      .value.trim();
    const saveBtn = document.getElementById("save-edit-btn");

    try {
      showLoading(saveBtn, "Saving...");
      await listingAPI.updateListing(listingId, { title, description });

      showSuccess("Listing updated successfully!", "modal-error-container");

      setTimeout(async () => {
        closeEditModal();
        await loadlisting();
      }, 1500);
    } catch (error) {
      hideLoading(saveBtn);
      showError(
        error.message || "Failed to update listing",
        "modal-error-container",
      );
    }
  });

//    Delete modal handling

function openDeleteModal() {
  document.getElementById("delete-modal").classList.remove("hidden");
  document.getElementById("delete-modal").classList.add("flex");
}
function closeDeleteModal() {
  document.getElementById("delete-modal").classList.add("hidden");
  document.getElementById("delete-modal").classList.remove("flex");
}
document
  .getElementById("cancel-delete-btn")
  .addEventListener("click", closeDeleteModal);
document
  .getElementById("confirm-delete-btn")
  .addEventListener("click", async () => {
    const deleteBtn = document.getElementById("confirm-delete-btn");

    try {
      showLoading(deleteBtn, "Deleting...");
      await listingAPI.deleteListing(listingId);
      showSuccess("Listing deleted successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/pages/profile.html";
      }, 1500);
    } catch (error) {
      showError(error.message || "Failed to delete listing. Please try again.");
      closeDeleteModal();
    } finally {
      hideLoading(deleteBtn);
    }
  });
loadlisting();
