// regions.js
import {
    populateDropdown,
    clearDropdown,
    disableDropdown,
    enableDropdown,
    resetDependentDropdowns,
    attachDropdownListener,
    renderNoResults,
    renderError
} from "./main.js";

import { getRegions } from "./api.js";

// DOM elements
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");
const scaleSelect = document.getElementById("scaleSelect");
const typeSelect = document.getElementById("typeSelect");
const resultsContainer = document.getElementById("results");

// Load initial data when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadStates();
    setupListeners();
});

// ---------------------------------------------
// STEP 1: Load States
// ---------------------------------------------
async function loadStates() {
    try {
        const data = await getRegions(); // fetch all regions
        const states = [...new Set(data.map(item => item.State))].sort();

        populateDropdown(stateSelect, states, "Select a State");
    } catch (err) {
        renderError(resultsContainer, "Failed to load states.");
    }
}

// ---------------------------------------------
// STEP 2: Load Cities for Selected State
// ---------------------------------------------
async function loadCities(state) {
    try {
        const data = await getRegions({ state });
        const cities = [...new Set(data.map(item => item.City_Town_Other))].sort();

        populateDropdown(citySelect, cities, "Select a City");
    } catch (err) {
        renderError(resultsContainer, "Failed to load cities.");
    }
}

// ---------------------------------------------
// STEP 3: Load Scales for Selected City
// ---------------------------------------------
async function loadScales(state, city) {
    try {
        const data = await getRegions({ state, city });
        const scales = [...new Set(data.map(item => item.Scale))].sort();

        populateDropdown(scaleSelect, scales, "Select Scale");
    } catch (err) {
        renderError(resultsContainer, "Failed to load scales.");
    }
}

// ---------------------------------------------
// STEP 4: Load Types for Selected Scale
// ---------------------------------------------
async function loadTypes(state, city, scale) {
    try {
        const data = await getRegions({ state, city, scale });
        const types = [...new Set(data.map(item => item.Type))].sort();

        populateDropdown(typeSelect, types, "Select Type");
    } catch (err) {
        renderError(resultsContainer, "Failed to load types.");
    }
}

// ---------------------------------------------
// STEP 5: Load Results for Selected Type
// ---------------------------------------------
async function loadResults(state, city, scale, type) {
    try {
        const data = await getRegions({ state, city, scale, type });

        // If no employers found
        if (!data || data.length === 0) {
            resultsContainer.innerHTML = `<p>No Employers Shown At This Time</p>`;
            return;
        }

        // Filter out rows with no employer name
        const employers = data.filter(item => item.EmployerName);

        if (employers.length === 0) {
            resultsContainer.innerHTML = `<p>No Employers Shown At This Time</p>`;
            return;
        }

        // Render only EmployerName + EmployerLink
        resultsContainer.innerHTML = employers
            .map(item => {
                const name = item.EmployerName;
                const link = item.EmployerLink;

                return `
                    <div class="region-card">
                        <h3>
                            ${
                                link
                                    ? `<a href="${link}" target="_blank">${name}</a>`
                                    : name
                            }
                        </h3>
                    </div>
                `;
            })
            .join("");

    } catch (err) {
        renderError(resultsContainer, "Failed to load results.");
    }
}


// ---------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------
function setupListeners() {

    // When state changes → load cities
    attachDropdownListener(stateSelect, (state) => {
        resetDependentDropdowns([citySelect, scaleSelect, typeSelect]);
        clearResults();

        if (state) {
            loadCities(state);
        }
    });

    // When city changes → load scales
    attachDropdownListener(citySelect, (city) => {
        resetDependentDropdowns([scaleSelect, typeSelect]);
        clearResults();

        const state = stateSelect.value;
        if (state && city) {
            loadScales(state, city);
        }
    });

    // When scale changes → load types
    attachDropdownListener(scaleSelect, (scale) => {
        resetDependentDropdowns([typeSelect]);
        clearResults();

        const state = stateSelect.value;
        const city = citySelect.value;

        if (state && city && scale) {
            loadTypes(state, city, scale);
        }
    });

    // When type changes → load results
    attachDropdownListener(typeSelect, (type) => {
        clearResults();

        const state = stateSelect.value;
        const city = citySelect.value;
        const scale = scaleSelect.value;

        if (state && city && scale && type) {
            loadResults(state, city, scale, type);
        }
    });
}

// Clear results container
function clearResults() {
    resultsContainer.innerHTML = "";
}
