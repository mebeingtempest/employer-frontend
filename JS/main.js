// ===============================
// MAIN.JS — Shared Frontend Utilities
// ===============================

// ---------------------------------------------
// GLOBAL DATA CACHES — Now using static JSON files
// ---------------------------------------------

// Regions dataset
export let allRegions = [];
export async function initRegions() {
    try {
        const res = await fetch('/public/regionsdata.json');
        allRegions = await res.json();
        console.log("Full Regions dataset loaded:", allRegions.length, "rows");
    } catch (err) {
        console.error("Failed to load Regions dataset:", err);
    }
}

// Jobs-by-date dataset
export let allJobsByDate = [];
export async function initJobsByDate() {
    try {
        const res = await fetch('/public/dateposteddata.json');
        allJobsByDate = await res.json();
        console.log("Full Jobs-by-Date dataset loaded:", allJobsByDate.length, "rows");
    } catch (err) {
        console.error("Failed to load Jobs-by-Date dataset:", err);
    }
}

// Industries dataset
export let allIndustries = [];
export async function initIndustries() {
    try {
        const res = await fetch('/public/industriesdata.json');
        allIndustries = await res.json();
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

// ===============================
// MOBILE NAVIGATION + SUBMENU LOGIC
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // MOBILE MENU TOGGLE
    // -----------------------------
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
        });
    }

    // -----------------------------
    // SUBMENU TOGGLES (mobile only)
    // -----------------------------
    const submenuButtons = document.querySelectorAll(".submenu-toggle");

    submenuButtons.forEach(button => {
        button.addEventListener("click", () => {
            const parent = button.closest(".has-submenu");
            const submenu = parent.querySelector(".submenu");

            submenu.classList.toggle("open");
        });
    });

});
