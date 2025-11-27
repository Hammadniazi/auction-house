import { renderNavigation } from "../components/navigation.js";
import { listingAPI } from "../api/api.js";
import { showError } from "../utils/helpers.js";

//  Initialize Navigation
renderNavigation();

//  Get listings ID from URL
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

if (!listingId) {
  window.location.href = "/index.html";
}
let currentListing = null;

// Load listing

async function loadlisting() {
  try {
    const response = await listingAPI.getListing(listingId);
    currentListing = response.data;

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
       `;
}

loadlisting();
