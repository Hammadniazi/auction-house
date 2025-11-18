import {
  formatTimeRemaining,
  getTimeRemaining,
  getHighestBid,
  truncateText,
} from "../utils/helpers.js";

// Create a listing card component
export function createListingCard(listing) {
  const imageUrl = listing.media?.[0]?.url || "";
  const imageAlt = listing.media?.[0]?.alt || listing.title;
  const timeData = getTimeRemaining(listing.endsAt);
  const isExpired = timeData.isExpired;
  const timeRemainingText = formatTimeRemaining(listing.endsAt);
  const highestBid = getHighestBid(listing.bids);

  return `
  <div class="card cursor-pointer" onclick="window.location.href='/pages/listing.html?id=${
    listing.id
  }'">
      <div class="relative">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${imageAlt}" class="w-full h-48 object-cover" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">`
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
          isExpired
            ? '<div class="absolute top-2 right-2 badge-danger">Ended</div>'
            : '<div class="absolute top-2 right-2 badge-success">Active</div>'
        }
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">${
          listing.title
        }</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${truncateText(
          listing.description || "No description provided",
          100,
        )}</p>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Current Bid</p>
            <p class="text-xl font-bold text-primary-600 dark:text-primary-400">${highestBid} Credits</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 dark:text-gray-400">Time Left</p>
            <p class="text-sm font-semibold ${
              isExpired
                ? "text-red-600 dark:text-red-400"
                : "text-gray-800 dark:text-gray-200"
            }">${timeRemainingText}</p>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            <span class="font-semibold">${listing._count?.bids || 0}</span> bids
          </p>
        </div>
      </div>
    </div>`;
}

// Render listings grid
export function renderListings(listings, containerId = "listings-container") {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!listings || listings.length === 0) {
    container.innerHTML = `

         <div class="col-span-full text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
      </div>


        `;
    return;
  }
  container.innerHTML = listings
    .map((listing) => createListingCard(listing))
    .join("");
}
