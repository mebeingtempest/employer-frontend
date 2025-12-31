// ===============================
// MAIN.JS — Shared Frontend Utilities
// ===============================

// ---------------------------------------------
// GLOBAL DATA CACHES (Option A — Full Dataset Caching)
// ---------------------------------------------

// Regions dataset
export let allRegions = [];
export async function initRegions(getRegionsFunction) {
    try {
        allRegions = await getRegionsFunction();
        console.log("Full Regions dataset loaded:", allRegions.length, "rows");
    } catch (err) {
        console.error("Failed to load Regions dataset:", err);
    }
}

// Jobs-by-date dataset
export let allJobsByDate = [];
export async function initJobsByDate(getJobsByDateFunction) {
    try {
        allJobsByDate = await getJobsByDateFunction();
        console.log("Full Jobs-by-Date dataset loaded:", allJobsByDate.length, "rows");
    } catch (err) {
        console.error("Failed to load Jobs-by-Date dataset:", err);
    }
}

// Industries dataset
export let allIndustries = [];
export async function initIndustries(getIndustriesFunction) {
    try {
        allIndustries = await getIndustriesFunction();
        console.log("Full Industries dataset loaded:", allIndustries.length, "rows");
    } catch (err) {
        console.error("Failed to load Industries dataset:", err);
    }
}

// ===============================
// DROPDOWN HELPERS
// ===============================

export function populateDropdown(selectElement, items, placeholder = "Select an option") {
    clearDropdown(selectElement);
    enableDropdown(selectElement);

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholder;
    selectElement.appendChild(defaultOption);

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

export function clearDropdown(selectElement) {
    selectElement.innerHTML = "";
}

export function disableDropdown(selectElement) {
    selectElement.disabled = true;
}

export function enableDropdown(selectElement) {
    selectElement.disabled = false;
}

export function resetDependentDropdowns(dropdowns) {
    dropdowns.forEach(select => {
        clearDropdown(select);
        disableDropdown(select);
    });
}

export function attachDropdownListener(selectElement, callback) {
    selectElement.addEventListener("change", () => {
        const value = selectElement.value;
        callback(value);
    });
}

// ===============================
// RENDERING HELPERS
// ===============================

export function renderNoResults(container) {
    container.innerHTML = `<p>No results found.</p>`;
}

export function renderError(container, message = "An error occurred.") {
    container.innerHTML = `<p class="error">${message}</p>`;
}
