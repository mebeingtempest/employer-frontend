// industry.js
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

import { getIndustries } from "./api.js";

// DOM elements
const industrySelect = document.getElementById("industrySelect");
const subindustrySelect = document.getElementById("subindustrySelect");
const scaleSelect = document.getElementById("scaleSelect");
const typeSelect = document.getElementById("typeSelect");
const resultsContainer = document.getElementById("results");

// Load initial data when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadIndustries();
    setupListeners();
});

// ---------------------------------------------
// STEP 1: Load Industries
// ---------------------------------------------
async function loadIndustries() {
    try {
        const data = await getIndustries();
        const industries = [...new Set(data.map(item => item.Industry))].sort();

        populateDropdown(industrySelect, industries, "Select an Industry");
    } catch (err) {
        renderError(resultsContainer, "Failed to load industries.");
    }
}

// ---------------------------------------------
// STEP 2: Load Subindustries for Selected Industry
// ---------------------------------------------
async function loadSubindustries(industry) {
    try {
        const data = await getIndustries({ Industry: industry });
        const subindustries = [...new Set(data.map(item => item.Subindustry))].sort();

        populateDropdown(subindustrySelect, subindustries, "Select a Subindustry");
    } catch (err) {
        renderError(resultsContainer, "Failed to load subindustries.");
    }
}

// ---------------------------------------------
// STEP 3: Load Scales for Selected Subindustry
// ---------------------------------------------
async function loadScales(industry, subindustry) {
    try {
        const data = await getIndustries({ Industry: industry, Subindustry: subindustry });
        const scales = [...new Set(data.map(item => item.Scale))].sort();

        populateDropdown(scaleSelect, scales, "Select Scale");
    } catch (err) {
        renderError(resultsContainer, "Failed to load scales.");
    }
}

// ---------------------------------------------
// STEP 4: Load Types for Selected Scale
// ---------------------------------------------
async function loadTypes(industry, subindustry, scale) {
    try {
        const data = await getIndustries({
            Industry: industry,
            Subindustry: subindustry,
            Scale: scale
        });
        const types = [...new Set(data.map(item => item.Type))].sort();

        populateDropdown(typeSelect, types, "Select Type");
    } catch (err) {
        renderError(resultsContainer, "Failed to load types.");
    }
}

// ---------------------------------------------
// STEP 5: Load Results for Selected Type
// ---------------------------------------------
async function loadResults(industry, subindustry, scale, type) {
    try {
        const data = await getIndustries({
            Industry: industry,
            Subindustry: subindustry,
            Scale: scale,
            Type: type
        });

        if (!data || data.length === 0) {
            resultsContainer.innerHTML = `<p>No Employers Shown At This Time</p>`;
            return;
        }

        const employers = data.filter(item => item.EmployerName);

        if (employers.length === 0) {
            resultsContainer.innerHTML = `<p>No Employers Shown At This Time</p>`;
            return;
        }

        resultsContainer.innerHTML = employers
            .map(item => {
                const name = item.EmployerName;
                const link = item.EmployerLink;

                return `
                    <div class="industry-card">
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

    attachDropdownListener(industrySelect, (industry) => {
        resetDependentDropdowns([subindustrySelect, scaleSelect, typeSelect]);
        clearResults();

        if (industry) {
            loadSubindustries(industry);
        }
    });

    attachDropdownListener(subindustrySelect, (subindustry) => {
        resetDependentDropdowns([scaleSelect, typeSelect]);
        clearResults();

        const industry = industrySelect.value;
        if (industry && subindustry) {
            loadScales(industry, subindustry);
        }
    });

    attachDropdownListener(scaleSelect, (scale) => {
        resetDependentDropdowns([typeSelect]);
        clearResults();

        const industry = industrySelect.value;
        const subindustry = subindustrySelect.value;

        if (industry && subindustry && scale) {
            loadTypes(industry, subindustry, scale);
        }
    });

    attachDropdownListener(typeSelect, (type) => {
        clearResults();

        const industry = industrySelect.value;
        const subindustry = subindustrySelect.value;
        const scale = scaleSelect.value;

        if (industry && subindustry && scale && type) {
            loadResults(industry, subindustry, scale, type);
        }
    });
}

function clearResults() {
    resultsContainer.innerHTML = "";
}
