import { renderNavigation } from "../components/navigation";
import { listingAPI } from "../api/api.js";
import { renderListings } from "../components/listings.js";

// Initialize navigation
renderNavigation();

let allListings = [];
let filteredListings = [];

async function loadListings() {
  try {
    const data = await listingAPI.getAllListings({
      sort: "created",
      sortOrder: "desc",
    });

    console.log("Api-response:", data);

    allListings = data.data || [];

    console.log("All listings:", allListings);
    filteredListings = [...allListings];

    renderListings(filteredListings);
  } catch (error) {
    console.error("Error loading listings: ", error);
  }
}
loadListings();
