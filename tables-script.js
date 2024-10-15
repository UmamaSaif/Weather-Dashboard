

// ... (rest of the code remains the same)

// Replace 'YOUR_API_KEY' with your actual OpenWeather API key
const API_KEY = 'd4b409683fef8a68350702b2d5887937';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherTable = document.getElementById('weatherTable');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatAnswers = document.getElementById('chatAnswers');
const filterOptions = document.getElementById('filterOptions');
const applyFilterBtn = document.getElementById('applyFilterBtn');
let weatherData = [];


searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    try {
        const forecastResponse = await fetch(`${API_BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastResponse.json();
        
        if (forecastData.cod === "200") {
            updateWeatherTable(forecastData);
        } else {
            // Handle API errors (like "city not found")
            throw new Error(forecastData.message || 'City not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Display a user-friendly error message
        if (error.message.toLowerCase().includes('city not found')) {
            alert(`Error: City "${city}" not found. Please check the spelling and try again.`);
        } else {
            alert(`Error: Unable to fetch weather data. Please try again later.`);
        }
        
        
    }
}

function updateWeatherTable(data) {
    weatherData = data.list.slice(0, 10); // Store the data for chatbot use
    const tableBody = weatherTable.querySelector('tbody');
    tableBody.innerHTML = '';

    if (weatherData.length === 0) {
        console.error('No weather data available to update the table');
        return;
    }

    weatherData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${item.main.temp}°C</td>
            <td>${item.main.humidity}%</td>
            <td>${item.wind.speed} m/s</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });

    console.log(`Updated table with ${weatherData.length} rows of weather data`);
}

sendBtn.addEventListener('click', () => {
    const message = chatInput.value;
    if (message) {
        addChatMessage('You', message);
        respondToMessage(message);
        chatInput.value = '';
    }
});

function addChatMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${sender}: ${message}`;
    chatAnswers.appendChild(messageElement);
    chatAnswers.scrollTop = chatAnswers.scrollHeight;
}
async function respondToMessage(message) {
    let response;

    if (isWeatherQuery(message)) {
        const city = extractCity(message);
        if (city) {
            try {
                await getWeatherData(city);
                if (weatherData.length > 0) {
                    response = formatWeatherResponse(weatherData[0], city);
                } else {
                    response = `Sorry, I couldn't fetch the weather data for ${city}.`;
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                response = `Sorry, there was an error fetching weather data for ${city}.`;
            }
        } else {
            response = "I'm sorry, but I couldn't identify a city in your query. Can you please specify the city name?";
        }
    } else {
        response = await handleNonWeatherQuery(message);
    }

    addChatMessage('Chatbot', response);
}// ... (previous code remains the same)

 // Store the weather data globally

function updateWeatherTable(data) {
    weatherData = data.list.slice(0, 10); // Store the data for chatbot use
    const tableBody = weatherTable.querySelector('tbody');
    tableBody.innerHTML = '';

    weatherData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${item.main.temp}°C</td>
            <td>${item.main.humidity}%</td>
            <td>${item.wind.speed} m/s</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// function respondToMessage(message) {
//     let response = "I'm sorry, I don't have enough information to answer that question.";
    
//     if (message.toLowerCase().includes('highest temperature')) {
//         const highest = Math.max(...weatherData.map(item => item.main.temp));
//         response = `The highest temperature this week is ${highest.toFixed(1)}°C.`;
//     } else if (message.toLowerCase().includes('lowest temperature')) {
//         const lowest = Math.min(...weatherData.map(item => item.main.temp));
//         response = `The lowest temperature this week is ${lowest.toFixed(1)}°C.`;
//     } else if (message.toLowerCase().includes('average temperature')) {
//         const sum = weatherData.reduce((acc, item) => acc + item.main.temp, 0);
//         const average = sum / weatherData.length;
//         response = `The average temperature this week is ${average.toFixed(1)}°C.`;
//     } else if (message.toLowerCase().includes('highest') && message.toLowerCase().includes('lowest') && message.toLowerCase().includes('average')) {
//         const temperatures = weatherData.map(item => item.main.temp);
//         const highest = Math.max(...temperatures);
//         const lowest = Math.min(...temperatures);
//         const average = temperatures.reduce((a, b) => a + b) / temperatures.length;
//         response = `This week's temperatures: Highest: ${highest.toFixed(1)}°C, Lowest: ${lowest.toFixed(1)}°C, Average: ${average.toFixed(1)}°C.`;
//     }

//     addChatMessage('Chatbot', response);
// }

function testAPI() {
    const testCity = 'London'; // You can change this to any city
    console.log(`Testing API with city: ${testCity}`);
    getWeatherData(testCity);
}

window.addEventListener('load', testAPI);

let currentPage = 1;
const entriesPerPage = 10;

function updateWeatherTable(data) {
    weatherData = data.list; // Store all the data for chatbot use
    displayWeatherData();
    updatePaginationControls();
}

function displayWeatherData() {
    const tableBody = weatherTable.querySelector('tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const pageData = weatherData.slice(startIndex, endIndex);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${item.main.temp}°C</td>
            <td>${item.main.humidity}%</td>
            <td>${item.wind.speed} m/s</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(weatherData.length / entriesPerPage);
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    paginationContainer.innerHTML = `
        <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;

    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.replaceWith(paginationContainer);
    } else {
        document.querySelector('.weather-table').appendChild(paginationContainer);
    }

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayWeatherData();
            updatePaginationControls();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayWeatherData();
            updatePaginationControls();
        }
    });
}

// Add event listener to the filter button
applyFilterBtn.addEventListener('click', () => {
    const selectedFilter = filterOptions.value;
    if (weatherData.length > 0) {
        switch (selectedFilter) {
            case 'ascending':
                sortTemperaturesAscending();
                break;
            case 'descending':
                sortTemperaturesDescending();
                break;
            case 'rain':
                filterDaysWithRain();
                break;
            case 'highestTemp':
                showDayWithHighestTemperature();
                break;
        }
    }
});

// Sort temperatures in ascending order
function sortTemperaturesAscending() {
    const sortedData = [...weatherData].sort((a, b) => a.main.temp - b.main.temp);
    updateWeatherTableWithFilter(sortedData);
}

// Sort temperatures in descending order
function sortTemperaturesDescending() {
    const sortedData = [...weatherData].sort((a, b) => b.main.temp - a.main.temp);
    updateWeatherTableWithFilter(sortedData);
}

// Filter out days without rain
function filterDaysWithRain() {
    const filteredData = weatherData.filter(item => item.weather[0].description.includes('rain'));
    updateWeatherTableWithFilter(filteredData);
}

// Show the day with the highest temperature
function showDayWithHighestTemperature() {
    const highestTempDay = weatherData.reduce((prev, current) => {
        return (current.main.temp > prev.main.temp) ? current : prev;
    });
    updateWeatherTableWithFilter([highestTempDay]);
}

// Function to update the table with the filtered/sorted data
function updateWeatherTableWithFilter(filteredData) {
    const tableBody = weatherTable.querySelector('tbody');
    tableBody.innerHTML = ''; // Clear the table first

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${item.main.temp}°C</td>
            <td>${item.main.humidity}%</td>
            <td>${item.wind.speed} m/s</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });
}

function isWeatherQuery(query) {
    return query.toLowerCase().includes("weather");
}

async function handleUserQuery(query) {
    if (isWeatherQuery(query)) {
        const city = extractCity(query); // Implement a function to extract the city name from the query
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            return formatWeatherResponse(weatherData); // Create a function to format the response
        } else {
            return "Sorry, I couldn't fetch the weather data.";
        }
    } else {
        return await handleNonWeatherQuery(query); // Call the Gemini API for non-weather queries
    }
}

async function handleNonWeatherQuery(query) {
    const apiKey = 'AIzaSyBfDN9hhk0Xew_wMgazAYKvXY4EuvTvzV0'; // Replace with your Gemini API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const bodyData = {
        contents: [
            {
                parts: [
                    {
                        text: query
                    }
                ]
            }
        ]
    };

    console.log("Fetching from:", url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            throw new Error(`Gemini API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the generated text from the response
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const generatedText = data.candidates[0].content.parts[0].text;
            return generatedText;
        } else {
            throw new Error("No valid response content found");
        }
    } catch (error) {
        console.error("Error querying Gemini API:", error);
        return "I'm sorry, I couldn't process that request. Error: " + error.message;
    }
}


function formatWeatherResponse(weatherItem, city) {
    const temperature = weatherItem.main.temp.toFixed(1);
    const humidity = weatherItem.main.humidity.toFixed(1);
    const windSpeed = weatherItem.wind.speed.toFixed(1);
    const description = weatherItem.weather[0].description;

    return `Current weather in ${city}: ${description}. Temperature: ${temperature}°C, Humidity: ${humidity}%, Wind Speed: ${windSpeed} m/s.`;
}

function extractCity(query) {
    // List of common words that might precede a city name
    const cityIndicators = ['in', 'for', 'at', 'of', 'to'];
    
    // Convert query to lowercase for easier matching
    const lowercaseQuery = query.toLowerCase();
    
    // Try to find a city based on common patterns
    for (let indicator of cityIndicators) {
        const index = lowercaseQuery.indexOf(` ${indicator} `);
        if (index !== -1) {
            // Extract the part of the string after the indicator
            const possibleCity = query.slice(index + indicator.length + 2).split(',')[0].trim();
            // Check if it's not just a single word (likely not a full city name)
            if (possibleCity.includes(' ') || possibleCity.length > 5) {
                return possibleCity;
            }
        }
    }

    // If no city found with indicators, fall back to looking for capitalized words
    const words = query.split(" ");
    const capitalizedWords = words.filter(word => 
        word.charAt(0) === word.charAt(0).toUpperCase() && 
        word.slice(1) === word.slice(1).toLowerCase() &&
        word.length > 1 &&
        !cityIndicators.includes(word.toLowerCase())
    );

    if (capitalizedWords.length > 0) {
        // Join consecutive capitalized words
        let cityName = '';
        for (let word of capitalizedWords) {
            if (cityName && !cityIndicators.includes(words[words.indexOf(word) - 1].toLowerCase())) {
                cityName += ' ' + word;
            } else if (!cityName) {
                cityName = word;
            } else {
                break;
            }
        }
        return cityName;
    }

    // If still no city found, return null or a default message
    return null;
}