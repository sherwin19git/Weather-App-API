# 🌤️ Weather App

A modern, responsive weather application that fetches real-time weather data using the OpenWeatherMap API. Built with vanilla HTML, CSS, and JavaScript with a focus on clean code and excellent user experience.

## ✨ Features

- **Real-time Weather Data**: Fetch current weather conditions for any city worldwide
- **Detailed Weather Information**: Temperature, humidity, wind speed, pressure, and visibility
- **Favorite Cities**: Save your favorite cities for quick access using localStorage
- **Dark Mode Toggle**: Switch between light and dark themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during API requests with spinner animation
- **Error Handling**: Comprehensive error messages for invalid input and API failures
- **Smooth Animations**: Fade-in effects and hover states for better UX

## 📋 Project Structure

```
weather-app/
├── index.html      # Main HTML structure
├── style.css       # Complete styling with responsive design
├── script.js       # Application logic with organized functions
└── config.js       # API configuration (API key)
```

## 🔑 API Information

### Base URL
```
https://api.openweathermap.org/data/2.5
```

### Endpoints Used

1. **Current Weather by City Name**
   - **Endpoint**: `/weather`
   - **Parameters**: `q` (city name), `units` (metric), `appid` (API key)
   - **Example**: `/weather?q=London&units=metric&appid=YOUR_API_KEY`

2. **Weather Forecast**
   - **Endpoint**: `/forecast`
   - **Parameters**: `lat` (latitude), `lon` (longitude), `units` (metric), `appid` (API key)
   - **Example**: `/forecast?lat=51.5&lon=-0.1&units=metric&appid=YOUR_API_KEY`

3. **Geo Coding**
   - **Endpoint**: `/geo/1.0/direct`
   - **Parameters**: `q` (city name), `limit` (results), `appid` (API key)

### Authentication
- **Type**: API Key
- **Required**: Yes
- **Header**: Query parameter (`appid`)

### Sample JSON Response

```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "few clouds",
      "icon": "02d"
    }
  ],
  "main": {
    "temp": 15.8,
    "feels_like": 15.2,
    "humidity": 72,
    "pressure": 1013
  },
  "wind": { "speed": 5.5 },
  "visibility": 10000,
  "name": "London"
}
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free tier available)

### Setup Instructions

1. **Clone or Download the Project**
   ```bash
   cd weather-app
   ```

2. **Get Your API Key**
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate a free API key

3. **Configure the API Key**
   - Open `config.js` file
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'https://api.openweathermap.org/data/2.5',
     API_KEY: 'your_actual_api_key_here', // ← Replace this
     UNITS: 'metric'
   };
   ```

4. **Open the Application**
   - Double-click `index.html` or serve using a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```
   - Open `http://localhost:8000` in your browser

## 📖 Usage Guide

### Searching for Weather
1. Enter a city name in the search input field
2. Press Enter or click the "Search" button
3. View detailed weather information in the results card
4. Weather data will automatically be added to favorites

### Managing Favorites
- Click on any favorite city to quickly fetch its weather
- Remove favorites by clicking the ✕ button on the favorite card
- Clear all favorites with the "Clear Favorites" button

### Theme Toggle
- Click the moon/sun icon in the header to toggle between light and dark modes
- Your theme preference is automatically saved

## 💡 Code Organization

### API Functions
- `fetchWeatherByCity(cityName)`: Fetches weather data for a city
- `fetchWeatherForecast(lat, lon)`: Fetches forecast data

### DOM Functions
- `displayWeather(weatherData)`: Updates DOM with weather information
- `updateFavoritesList()`: Renders favorites list
- `toggleTheme()`: Switches between light/dark modes

### Utility Functions
- `isValidInput(input)`: Validates user input
- `showError(message)`: Displays error messages
- `formatDate(timestamp)`: Formats Unix timestamps
- `showLoading()` / `hideLoading()`: Manages loading states

## ✅ Error Handling

The app handles the following scenarios:

1. **No API Key Configured**: Clear message prompting to add API key
2. **Invalid City Name**: Specific error for city not found
3. **Invalid API Key**: Error message indicating authentication failure
4. **Network Failures**: Generic error with retry suggestion
5. **Empty Input**: Validation message for empty search field
6. **Auto-clearing Errors**: Errors automatically disappear after 5 seconds

## 🎨 Design Features

- **Card-based Layout**: Clean, organized weather information
- **Gradient Background**: Purple gradient for visual appeal
- **Responsive Grid**: Weather details adapt to screen size
- **Dark Mode**: Complete theme system with CSS variables
- **Hover Effects**: Interactive buttons with smooth transitions
- **Loading Spinner**: Animated spinner during data fetching
- **Custom Scrollbar**: Styled scrollbar in favorites list

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (1200px+)
- **Tablet**: Adjusted spacing and grid (768px - 1199px)
- **Mobile**: Single column layout (480px - 767px)
- **Small Mobile**: Compact design (<480px)

## 🔒 Security Notes

- ⚠️ Never commit your actual API key to GitHub
- Use a `.gitignore` file to exclude `config.js`
- Keep API key confidential
- Consider using environment variables in production

## 📝 Comments in Code

The code includes comprehensive comments explaining:
- Function purposes and parameters
- API request construction and handling
- DOM manipulation logic
- Error handling strategies
- Async/await usage

## 🎯 Next Steps / Future Enhancements

- [ ] Add weather forecast for multiple days
- [ ] Implement geolocation for automatic city detection
- [ ] Add weather alerts and notifications
- [ ] Create weather comparison between cities
- [ ] Add more detailed UV index and pollen information
- [ ] Implement PWA features for offline access

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues with the OpenWeatherMap API, visit [their documentation](https://openweathermap.org/api).

---

**Happy Weather Checking!** 🌈☀️
