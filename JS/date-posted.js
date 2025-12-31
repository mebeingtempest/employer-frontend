// date-posted.js
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

import { getJobsByDate } from "./api.js";

// DOM elements
const datepostedSelect = document.getElementById("datepostedSelect");
const scaleSelect = document.getElementById("scaleSelect");
const typeSelect = document.getElementById("typeSelect");
const resultsContainer = document.getElementById("results");

// Load initial data when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadDateOptions();
    setupListeners();
});

// ---------------------------------------------
// STEP 1: Load Date Posted Options
// ---------------------------------------------
function loadDateOptions() {
    const dateRanges = [
        "Last 3 Days",
        "Last 7 Days",
        "Last 14 Days"
    ];

    populateDropdown(datepostedSelect, dateRanges, "Select Date Range");
}

// ---------------------------------------------
// STEP 2: Load Scales for Selected Date Range
// ---------------------------------------------
async function loadScales(dateRange) {
    try {
        const data = await getJobsByDate({ DatePosted: dateRange });
        const scales = [...new Set(data.map(item => item.Scale))].sort();

        populateDropdown(scaleSelect, scales, "Select Scale");
    } catch (err) {
        renderError(resultsContainer, "Failed to load scales.");
    }
}

// ---------------------------------------------
// STEP 3: Load Types for Selected Scale
// ---------------------------------------------
async function loadTypes(dateRange, scale) {
    try {
        const data = await getJobsByDate({ DatePosted: dateRange, Scale: scale });
        const types = [...new Set(data.map(item => item.Type))].sort();

        populateDropdown(typeSelect, types, "Select Type");
    } catch (err) {
        renderError(resultsContainer, "Failed to load types.");
    }
}

// ---------------------------------------------
// STEP 4: Load Results for Selected Type
// (Corrected to match Industries.js pattern)
// ---------------------------------------------
async function loadResults(dateRange, scale, type) {
    try {
        const data = await getJobsByDate({
            DatePosted: dateRange,
            Scale: scale,
            Type: type
        });

        // If no results at all
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
                    <div class="dateposted-card">
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

    attachDropdownListener(datepostedSelect, (dateRange) => {
        resetDependentDropdowns([scaleSelect, typeSelect]);
        clearResults();

        if (dateRange) {
            loadScales(dateRange);
        }
    });

    attachDropdownListener(scaleSelect, (scale) => {
        resetDependentDropdowns([typeSelect]);
        clearResults();

        const dateRange = datepostedSelect.value;

        if (dateRange && scale) {
            loadTypes(dateRange, scale);
        }
    });

    attachDropdownListener(typeSelect, (type) => {
        clearResults();

        const dateRange = datepostedSelect.value;
        const scale = scaleSelect.value;

        if (dateRange && scale && type) {
            loadResults(dateRange, scale, type);
        }
    });
}

function clearResults() {
    resultsContainer.innerHTML = "";
}
