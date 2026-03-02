const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');


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

        
        spinner.classList.remove('hidden');

        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

    
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        
        if (country.borders) {
            borderingCountries.innerHTML = "<h3>Bordering Countries</h3>";
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


searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});


countryInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCountry(countryInput.value.trim());
    }
});
