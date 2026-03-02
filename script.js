const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

// Hide spinner initially
spinner.classList.add('hidden');

async function searchCountry(countryName) {
    if (!countryName) {
        showError("Please enter a country name.");
        return;
    }

    try {
        // Clear previous results
        errorMessage.textContent = "";
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";

        // Show loading spinner
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // Fetch bordering countries if they exist
        if (country.borders) {
            for (let borderCode of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderDiv = document.createElement('div');
                borderDiv.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
                `;

                borderingCountries.appendChild(borderDiv);
            }
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        showError(error.message || "Something went wrong. Please try again.");
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
}

// Event listener: Button click
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

// Event listener: Press Enter
countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});
