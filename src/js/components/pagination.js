//  Pagination state

let currentPage = 1;
let totalItems = 0;
let itemsPerPage = 12;
let onPageChangeCallback = null;

export function resetPagination() {
  currentPage = 1;
}

export function setTotalItems(total) {
  totalItems = total;
}

export function setItemsPerPage(items) {
  itemsPerPage = items;
}

export function getCurrentPage() {
  return currentPage;
}
function getTotalPages() {
  return Math.ceil(totalItems / itemsPerPage);
}

export function getPageItems(items) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}
export function goToPage(pageNumber) {
  const totalPages = getTotalPages();
  if (pageNumber < 1 || pageNumber > totalPages) {
    return;
  }
  currentPage = pageNumber;
  if (onPageChangeCallback) {
    onPageChangeCallback(currentPage);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
export function onPageChange(callback) {
  onPageChangeCallback = callback;
}

export function renderPagination(containerId = "pagination") {
  const totalPages = getTotalPages();
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Pagination container #${containerId} not found`);
    return;
  }

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }
  let paginationHTML = "";

  //   Previous button
  if (currentPage > 1) {
    paginationHTML += `
      <button 
        data-page="${currentPage - 1}"
        class="pagination-btn px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
        aria-label="Previous page"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
    `;
  }

  // Show first 2 pages
  const startPagesToShow = Math.min(2, totalPages);
  for (let i = 1; i <= startPagesToShow; i++) {
    const isActive = i === currentPage;
    paginationHTML += `
      <button 
        data-page="${i}"
        class="pagination-btn px-3 py-2 rounded-lg transition-colors shadow-sm ${
          isActive
            ? "bg-primary-600 text-white font-bold border border-primary-600"
            : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-600"
        }"
        ${isActive ? 'aria-current="page"' : ""}
      >
        ${i}
      </button>
    `;
  }

  // Ellipsis in the middle (if there are pages between start and end)
  if (totalPages > 4) {
    paginationHTML += `<span class="px-2 text-gray-500 dark:text-gray-400">...</span>`;
  }

  // Show last 2 pages (only if total pages > 4 to avoid overlap)
  if (totalPages > 4) {
    const endPagesToShow = 2;
    for (let i = totalPages - endPagesToShow + 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      paginationHTML += `
        <button 
          data-page="${i}"
          class="pagination-btn px-3 py-2 rounded-lg transition-colors shadow-sm ${
            isActive
              ? "bg-primary-600 text-white font-bold border border-primary-600"
              : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-600"
          }"
          ${isActive ? 'aria-current="page"' : ""}
        >
          ${i}
        </button>
      `;
    }
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
      <button 
        data-page="${currentPage + 1}"
        class="pagination-btn px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
        aria-label="Next page"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    `;
  }

  container.innerHTML = paginationHTML;

  // Add event listeners to all pagination buttons
  container.querySelectorAll(".pagination-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const pageNumber = parseInt(e.currentTarget.dataset.page);
      goToPage(pageNumber);
    });
  });
}
