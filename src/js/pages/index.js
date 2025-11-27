import { renderNavigation } from "../components/navigation";
import { renderListings, showListingsLoading } from "../components/listings.js";
import { listingAPI } from "../api/api.js";
import { showError, clearMessages } from "../utils/helpers.js";

// Initialize navigation
renderNavigation();

let allListings = [];
let filteredListings = [];
let currentSort = "created-desc";

// Load listings from API
async function loadListings() {
  showListingsLoading();
  clearMessages();

  try {
    const data = await listingAPI.getAllListings({
      sort: "created",
      sortOrder: "desc",
      _active: true,
    });

    console.log("Api-response:", data);

    allListings = data.data || [];

    console.log("All listings:", allListings);
    filteredListings = [...allListings];
    renderListings(filteredListings);
  } catch (error) {
    console.error("Error loading listings: ", error);
    showError("Failed to load listings. Please try again.");
    renderListings([]);
  }
}

//  Sort listings
function sortListings(sortType) {
  currentSort = sortType;

  switch (sortType) {
    case "created-desc":
      filteredListings.sort(
        (a, b) => new Date(b.created) - new Date(a.created),
      );
      break;
    case "created-asc":
      filteredListings.sort(
        (a, b) => new Date(a.created) - new Date(b.created),
      );
      break;
    case "ending-soon":
      filteredListings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
      break;
    case "title-asc":
      filteredListings.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  renderListings(filteredListings);
}

//  Search listings
async function searchListings(query) {
  if (!query.trim()) {
    filteredListings = [...allListings];
    // renderListings(filteredListings);
    sortListings(currentSort);
    return;
  }
  showListingsLoading();
  clearMessages();
  try {
    const response = await listingAPI.searchListings(query);
    filteredListings = response.data || [];
    // renderListings(filteredListings);
    sortListings(currentSort);
  } catch (error) {
    console.error("Error searching listings:", error);
    showError("Search failed. Please try again.");
    filteredListings = allListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description?.toLowerCase().includes(query.toLowerCase()),
    );
    renderListings(filteredListings);
  }
}

//  Event listeners for search
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

searchBtn.addEventListener("click", () => {
  const query = document.getElementById("search-input").value;
  searchListings(query);
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value;
    searchListings(query);
  }
});
// Event Listener for sort dropdown
sortSelect.addEventListener("change", (e) => {
  sortListings(e.target.value);
});

loadListings();
