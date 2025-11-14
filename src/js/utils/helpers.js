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
