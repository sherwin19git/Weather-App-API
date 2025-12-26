/* ===========================
   WEATHER APP - JAVASCRIPT
   =========================== */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Trims whitespace from input and checks if it's empty
 * @param {string} input - User input to validate
 * @returns {boolean} - True if valid, false if empty
 */
function isValidInput(input) {
  return input.trim().length > 0;
}

/**
 * Displays error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.textContent = message;
  errorContainer.classList.remove('error-hidden');

  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorContainer.classList.add('error-hidden');
  }, 5000);
}

/**
 * Shows loading spinner and message
 */
function showLoading() {
  document.getElementById('loadingMessage').classList.remove('loading-hidden');
  document.getElementById('searchBtn').disabled = true;
}

/**
 * Hides loading spinner and message
 */
function hideLoading() {
  document.getElementById('loadingMessage').classList.add('loading-hidden');
  document.getElementById('searchBtn').disabled = false;
}

/**
 * Hides error container
 */
function clearError() {
  document.getElementById('errorContainer').classList.add('error-hidden');
}

/**
 * Formats date to readable format
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Formatted date string
 */
function formatDate(timestamp) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(timestamp * 1000).toLocaleDateString('en-US', options);
}

/**
 * Capitalizes first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Fetches weather data from OpenWeatherMap API using city name
 * API Endpoint: /weather
 * @param {string} cityName - Name of the city to search
 * @returns {Promise<Object>} - Weather data object
 */
async function fetchWeatherByCity(cityName) {
  try {
    // Validate API key configuration
    if (API_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error(
        'API key not configured. Please add your OpenWeatherMap API key to config.js'
      );
    }

    // Construct API request URL with query parameters
    const url = `${API_CONFIG.BASE_URL}/weather?q=${encodeURIComponent(
      cityName
    )}&units=${API_CONFIG.UNITS}&appid=${API_CONFIG.API_KEY}`;

    console.log('Fetching weather data from:', url);

    // Make API call using fetch
    const response = await fetch(url);

    // Handle API response errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${cityName}" not found. Please check the spelling.`);
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    }

    // Parse JSON response
    const data = await response.json();
    console.log('Weather data received:', data);

    return data;
  } catch (error) {
    // Re-throw error for caller to handle
    throw error;
  }
}

/**
 * Fetches weather forecast data
 * API Endpoint: /forecast
 * @param {string} lat - Latitude coordinate
 * @param {string} lon - Longitude coordinate
 * @returns {Promise<Object>} - Forecast data object
 */
async function fetchWeatherForecast(lat, lon) {
  try {
    const url = `${API_CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${API_CONFIG.UNITS}&appid=${API_CONFIG.API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    return await response.json();
  } catch (error) {
    console.error('Forecast fetch error:', error);
    throw error;
  }
}

// ==========================================
// DOM MANIPULATION FUNCTIONS
// ==========================================

/**
 * Displays weather data in the DOM
 * Creates weather card with temperature, conditions, and details
 * @param {Object} weatherData - Weather data from API
 */
function displayWeather(weatherData) {
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ main, description, icon }],
    wind: { speed },
    visibility,
    dt,
    coord: { lat, lon }
  } = weatherData;

  // Update temperature and main weather info
  document.getElementById('cityName').textContent = name;
  document.getElementById('temperature').textContent = Math.round(temp);
  document.getElementById('weatherDesc').textContent = capitalizeFirst(description);
  document.getElementById('feelsLike').textContent = `Feels like ${Math.round(feels_like)}°C`;
  document.getElementById('weatherDate').textContent = formatDate(dt);

  // Update weather icon - OpenWeatherMap provides icon URLs
  document.getElementById('weatherIcon').src =
    `https://openweathermap.org/img/wn/${icon}@4x.png`;
  document.getElementById('weatherIcon').alt = main;

  // Update weather details (wind, humidity, pressure, visibility)
  document.getElementById('windSpeed').textContent = `${speed} m/s`;
  document.getElementById('humidity').textContent = `${humidity}%`;
  document.getElementById('pressure').textContent = `${pressure} hPa`;
  document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;

  // Show results container
  document.getElementById('resultsContainer').classList.remove('hidden');

  // Fetch and display 5-day forecast
  fetchAndDisplayForecast(lat, lon);

  // Add to favorites for quick access
  addToFavorites(name, temp);
}

/**
 * Clears weather display from DOM
 */
function clearWeatherDisplay() {
  document.getElementById('resultsContainer').classList.add('hidden');
}

/**
 * Fetches forecast data and displays 5-day forecast
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 */
async function fetchAndDisplayForecast(lat, lon) {
  try {
    const forecastData = await fetchWeatherForecast(lat, lon);
    displayForecast(forecastData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    // Silently fail - forecast is optional
  }
}

/**
 * Displays 5-day forecast in the DOM
 * Groups forecast data by day and shows max/min temperatures
 * @param {Object} forecastData - Forecast data from API
 */
function displayForecast(forecastData) {
  const { list } = forecastData;
  const forecastByDay = {};

  // Group forecast data by day
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (!forecastByDay[day]) {
      forecastByDay[day] = {
        dayName,
        temps: [],
        icons: [],
        descriptions: [],
        day
      };
    }

    forecastByDay[day].temps.push(item.main.temp);
    forecastByDay[day].icons.push(item.weather[0].icon);
    forecastByDay[day].descriptions.push(item.weather[0].main);
  });

  // Get next 5 days (skip today if already passed most of the day)
  const forecastDays = Object.values(forecastByDay).slice(1, 6);

  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  // Create forecast card for each day
  forecastDays.forEach((dayData) => {
    const maxTemp = Math.round(Math.max(...dayData.temps));
    const minTemp = Math.round(Math.min(...dayData.temps));
    const avgTemp = Math.round(dayData.temps.reduce((a, b) => a + b) / dayData.temps.length);
    
    // Use most common icon (last one in the list is typically evening/representative)
    const icon = dayData.icons[Math.floor(dayData.icons.length / 2)] || dayData.icons[0];
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';

    forecastCard.innerHTML = `
      <div class="forecast-date">${dayData.day}</div>
      <div class="forecast-day">${dayData.dayName}</div>
      <img src="${iconUrl}" alt="${dayData.descriptions[0]}" class="forecast-icon" />
      <div class="forecast-description">${dayData.descriptions[0]}</div>
      <div class="forecast-temps">
        <div class="forecast-temp-item">
          <span class="temp-label">Max:</span>
          <span class="temp-value">${maxTemp}°C</span>
        </div>
        <div class="forecast-temp-item">
          <span class="temp-label">Min:</span>
          <span class="temp-value">${minTemp}°C</span>
        </div>
      </div>
    `;

    forecastContainer.appendChild(forecastCard);
  });

  // Show forecast section
  document.getElementById('forecastSection').classList.remove('hidden');
}

/**
 * Adds city to favorites using localStorage for persistence
 * @param {string} cityName - City name
 * @param {number} temp - Current temperature
 */
function addToFavorites(cityName, temp) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Check if city already exists
  if (!favorites.find((fav) => fav.name.toLowerCase() === cityName.toLowerCase())) {
    favorites.push({ name: cityName, temp: Math.round(temp) });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
  }
}

/**
 * Removes city from favorites
 * @param {string} cityName - City name to remove
 */
function removeFromFavorites(cityName) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter((fav) => fav.name.toLowerCase() !== cityName.toLowerCase());
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesList();
}

/**
 * Updates favorites list display in DOM
 * Shows saved favorite cities as clickable cards
 */
function updateFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesList = document.getElementById('favoritesList');
  const favoritesSection = document.getElementById('favoritesSection');

  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesSection.classList.add('hidden');
    return;
  }

  favoritesSection.classList.remove('hidden');

  // Create card for each favorite city
  favorites.forEach((fav) => {
    const favoriteCard = document.createElement('div');
    favoriteCard.className = 'favorite-item';

    favoriteCard.innerHTML = `
      <div class="favorite-item-name">${fav.name}</div>
      <div class="favorite-item-temp">${fav.temp}°C</div>
      <button class="remove-favorite" aria-label="Remove ${fav.name}">✕</button>
    `;

    // Click to search this city
    favoriteCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('remove-favorite')) {
        searchWeather(fav.name);
      }
    });

    // Remove favorite button
    favoriteCard.querySelector('.remove-favorite').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromFavorites(fav.name);
    });

    favoritesList.appendChild(favoriteCard);
  });
}

// ==========================================
// THEME TOGGLE
// ==========================================

/**
 * Toggles between light and dark mode
 * Saves preference to localStorage
 */
function toggleTheme() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode');

  // Save theme preference
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

  // Update button text
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.textContent = isDarkMode ? '☀️' : '🌙';
}

/**
 * Loads saved theme preference on page load
 */
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  const themeBtn = document.getElementById('themeToggle');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
}

// ==========================================
// MAIN WEATHER SEARCH FUNCTION
// ==========================================

/**
 * Main function to handle weather search
 * Validates input, fetches data, and displays results
 * @param {string} cityName - City name to search (optional, uses input if not provided)
 */
async function searchWeather(cityName = null) {
  try {
    // Clear previous errors
    clearError();

    // Get city name from input or parameter
    const city = cityName || document.getElementById('cityInput').value.trim();

    // Validate input
    if (!isValidInput(city)) {
      showError('Please enter a city name');
      return;
    }

    // Show loading state
    showLoading();

    // Fetch weather data from API
    const weatherData = await fetchWeatherByCity(city);

    // Display weather in DOM
    displayWeather(weatherData);

    // Clear input field
    document.getElementById('cityInput').value = '';
  } catch (error) {
    // Handle and display errors
    console.error('Weather search error:', error);
    clearWeatherDisplay();
    showError(error.message || 'Failed to fetch weather data. Please try again.');
  } finally {
    // Always hide loading state
    hideLoading();
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Load theme preference
  loadThemePreference();

  // Load favorites on page load
  updateFavoritesList();

  // Search button click handler
  document.getElementById('searchBtn').addEventListener('click', () => {
    searchWeather();
  });

  // Enter key in input field
  document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchWeather();
    }
  });

  // Theme toggle button
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Clear favorites button
  document.getElementById('clearFavorites').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      localStorage.removeItem('favorites');
      updateFavoritesList();
    }
  });

  // Auto-trim whitespace from input
  document.getElementById('cityInput').addEventListener('blur', (e) => {
    e.target.value = e.target.value.trim();
  });
});
