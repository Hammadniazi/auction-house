export function validateEmail(email) {
  return email.endsWith("@stud.noroff.no");
}
4;

// Display error message

export function showError(message, containerId = "error-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
        <div class= "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <span class="block sm:inline">${message}</span>
        `;
    container.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
//  Clear Messages

export function clearMessages(containerId = "error-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
  }
}

//  Show loading state
export function showLoading(element, text = "Loading...") {
  element.disabled = true;
  element.dataset.originalText = element.textContent;
  element.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    ${text}
  `;
}
//  Hide loading state

export function hideLoading(element) {
  element.disabled = false;
  if (element.dataset.originalText) {
    element.textContent = element.dataset.originalText;
    delete element.dataset.originalText;
  }
}

// Display success message

export function showSuccess(message, containerId = "error-container") {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
        <span class="block sm:inline">${message}</span>
      </div>
      `;
    container.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
