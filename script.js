// Replace 'YOUR_API_KEY' with your actual OpenWeather API key
const API_KEY = 'd4b409683fef8a68350702b2d5887937';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherWidget = document.getElementById('weatherWidget');
const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weatherDescription');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const weatherIconEl = document.getElementById('weatherIcon');

let temperatureChart, conditionsChart, temperatureLineChart;


searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    }
});

const unitToggle = document.getElementById('unitToggle');
let currentUnit = 'metric'; // Default to Celsius

unitToggle.addEventListener('change', () => {
    currentUnit = unitToggle.checked ? 'imperial' : 'metric'; // Check the box for Fahrenheit
    if (cityInput.value) {
        getWeatherData(cityInput.value); // Re-fetch data in the selected unit
    }
});


async function getWeatherData(city) {
    try {
        showSpinner();
        const currentWeatherResponse = await fetch(`${API_BASE_URL}/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`);
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod !== 200) {
            throw new Error(currentWeatherData.message || 'City not found');
        }

        const forecastResponse = await fetch(`${API_BASE_URL}/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
            throw new Error(forecastData.message || 'Error fetching forecast data');
        }

        hideSpinner();
        updateWeatherWidget(currentWeatherData);
        updateCharts(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        hideSpinner();
        alert(`Error: ${error.message}`);
    }
}

// function updateWeatherWidget(data) {
//     cityNameEl.textContent = data.name;
//     temperatureEl.textContent = `Temperature: ${data.main.temp}°C`;
//     weatherDescriptionEl.textContent = data.weather[0].description;
//     humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
//     windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;
//     weatherIconEl.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
//     const tempInCelsius = data.main.temp;

//     const tempElement = document.querySelector('.temperature');
    
//     tempElement.dataset.celsius = tempInCelsius; // Store Celsius value for later conversion
    
//     if (currentUnit === 'imperial') {
//         const tempInFahrenheit = (tempInCelsius * 9/5) + 32;
//         tempElement.textContent = `${tempInFahrenheit.toFixed(1)}°F`;
//     } else {
//         tempElement.textContent = `${tempInCelsius.toFixed(1)}°C`;
//     }

//     // Change background based on weather condition
//     const condition = data.weather[0].main.toLowerCase();
//     weatherWidget.style.backgroundImage = `url('images/${condition}.jpg')`;
    
// }

function updateCharts(data) {
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    const labels = dailyData.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const temperatures = dailyData.map(item => item.main.temp);
    const conditions = dailyData.map(item => item.weather[0].main);

    updateTemperatureChart(labels, temperatures);
    updateConditionsChart(conditions);
    updateTemperatureLineChart(labels, temperatures);
}



function updateTemperatureChart(labels, temperatures) {
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `5-Day Temperature Forecast`
                }
            },
            animation: {
                delay: (context) => {
                    return context.dataIndex * 300;
                }
            }
        }
    });
}

function updateConditionsChart(conditions) {
    if (conditionsChart) {
        conditionsChart.destroy();
    }

    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('conditionsChart').getContext('2d');
    conditionsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weather Conditions Distribution'
                }
            },
            animation: {
                delay: (context) => {
                    return context.dataIndex * 300;
                }
            }
        }
    });
}

function updateTemperatureLineChart(labels, temperatures) {
    if (temperatureLineChart) {
        temperatureLineChart.destroy();
    }

    const ctx = document.getElementById('temperatureLineChart').getContext('2d');
    temperatureLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature Changes'
                }
            },
            animation: {
                y: {
                    duration: 1000,
                    easing: 'easeOutBounce'
                }
            }
        }
    });
}



function updateWeatherWidget(data) {
    const weatherData = document.getElementById('weatherData');
    const weatherWidget = document.getElementById('weatherWidget');

    if (!weatherWidget) {
        console.error('Weather widget element not found');
        return;
    }

    // Get the weather icon code
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    

    // Convert temperature based on the selected unit
    const tempCelsius = data.main.temp; // Temperature in Celsius
    let displayedTemp = tempCelsius; // Default displayed temperature is in Celsius

    if (currentUnit === 'imperial') {
        // Convert Celsius to Fahrenheit
        displayedTemp = (tempCelsius * 9 / 5) + 32;
    }



    weatherData.innerHTML = `
        <h3>${data.name}</h3>
        <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        <p>Temperature: ${displayedTemp.toFixed(1)}°${currentUnit === 'imperial' ? 'F' : 'C'}</p> 
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    const conditionCode = data.weather[0].id;

    let backgroundImage;
    let fallbackColor;

    if (conditionCode >= 200 && conditionCode < 300) {
        backgroundImage = 'Thunderstorm.jpg';
        fallbackColor = '#33A1DE'; // Dark blue
    } else if (conditionCode >= 300 && conditionCode < 600) {
        backgroundImage = 'Rain.jpg';
        fallbackColor = '#62B1F6'; // Light blue
    } else if (conditionCode >= 600 && conditionCode < 700) {
        backgroundImage = 'Snow.jpg';
        fallbackColor = '#FFFAFA'; // Snow white
    } else if (conditionCode === 800) {
        backgroundImage = 'Clear.jpg';
        fallbackColor = '#87CEEB'; // Sky blue
    } else if (conditionCode > 800 && conditionCode < 900) {
        backgroundImage = 'Clouds.jpg';
        fallbackColor = '#C0C0C0'; // Silver
    } else {
        backgroundImage = 'default.jpg';
        fallbackColor = '#F0F0F0'; // Light gray
    }

    // Set fallback color
    weatherWidget.style.backgroundColor = fallbackColor;

    // Construct the full path to the image
    const imagePath = backgroundImage;
    console.log(`Attempting to load image: ${imagePath}`);
    weatherWidget.style.backgroundImage = `url('${imagePath}')`;

    // Optional: Add a fallback mechanism if the image doesn't load
    weatherWidget.onerror = function () {
        console.error(`Image failed to load: ${imagePath}`);
        weatherWidget.style.backgroundImage = 'none'; 
    };

    
}

function showSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}




document.getElementById('unitToggle').addEventListener('change', function() {
    currentUnit = this.checked ? 'imperial' : 'metric';
    updateTemperatureDisplay();
});

function updateTemperatureDisplay() {
    const temperatureElements = document.querySelectorAll('.temperature');
    temperatureElements.forEach(element => {
        const tempInCelsius = parseFloat(element.dataset.celsius);
        if (currentUnit === 'imperial') {
            const tempInFahrenheit = (tempInCelsius * 9/5) + 32;
            element.textContent = `${tempInFahrenheit.toFixed(1)}°F`;
        } else {
            element.textContent = `${tempInCelsius.toFixed(1)}°C`;
        }
    });
}



