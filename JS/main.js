// ===============================
// MAIN.JS — Shared Frontend Utilities
// ===============================

// -------------------------------
// Dropdown Helpers
// -------------------------------

// Populate a dropdown with items
export function populateDropdown(selectElement, items, placeholder = "Select an option") {
    clearDropdown(selectElement);
    enableDropdown(selectElement);

    // Add placeholder
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholder;
    selectElement.appendChild(defaultOption);

    // Add items
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

// Clear all options from a dropdown
export function clearDropdown(selectElement) {
    selectElement.innerHTML = "";
}

// Disable a dropdown
export function disableDropdown(selectElement) {
    selectElement.disabled = true;
}

// Enable a dropdown
export function enableDropdown(selectElement) {
    selectElement.disabled = false;
}

// Reset multiple dropdowns at once
export function resetDependentDropdowns(dropdowns) {
    dropdowns.forEach(select => {
        clearDropdown(select);
        disableDropdown(select);
    });
}

// Attach a listener to a dropdown
export function attachDropdownListener(selectElement, callback) {
    selectElement.addEventListener("change", () => {
        const value = selectElement.value;
        callback(value);
    });
}

// -------------------------------
// Rendering Helpers
// -------------------------------

export function renderNoResults(container) {
    container.innerHTML = `<p>No results found.</p>`;
}

export function renderError(container, message = "An error occurred.") {
    container.innerHTML = `<p class="error">${message}</p>`;
}
