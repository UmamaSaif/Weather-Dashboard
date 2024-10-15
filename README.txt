Weather Dashboard App
Description
This Weather Dashboard App is a comprehensive web application that provides users with detailed weather information, forecasts, and data visualization. It features a responsive design, interactive charts, and a chatbot for answering weather-related queries.
Features

Weather Search: Users can search for weather information by city name.
Current Weather Display: Shows current temperature, humidity, wind speed, and weather description.
Temperature Unit Toggle: Switch between Celsius and Fahrenheit.
5-Day Forecast: Visualized through interactive charts:

Bar chart for temperature trends
Doughnut chart for weather condition distribution
Line chart for temperature changes


Detailed Weather Table: Displays forecast data in a tabular format with pagination.
Filtering Options: Users can filter and sort weather data based on various criteria.
Chatbot Integration: An AI-powered chatbot for answering weather-related questions.

Technologies Used

HTML5
CSS3
JavaScript (ES6+)
Chart.js for data visualization
OpenWeather API for weather data
Google's Gemini API for chatbot functionality

Setup and Installation

Clone the repository:
Copygit clone [your-repo-link]

Navigate to the project directory:
Copycd weather-dashboard-app

Open index.html in a web browser to view the dashboard.
Open tables.html to view the detailed weather table and chatbot interface.

Configuration

OpenWeather API:

Sign up for a free API key at OpenWeather
Replace YOUR_API_KEY in script.js with your actual API key


Google Gemini API:

Obtain an API key from Google AI Studio
Replace YOUR_GEMINI_API_KEY in tables-script.js with your actual API key



Usage
Dashboard Page (index.html)

Enter a city name in the search bar and click "Get Weather" to fetch weather data.
Toggle between Celsius and Fahrenheit using the unit switch.
View current weather conditions and forecasts in the charts.

Tables Page (tables.html)

Search for a city to view detailed weather data in a table format.
Use pagination controls to navigate through the forecast data.
Apply filters to sort or filter the weather data.
Use the chatbot to ask weather-related questions.

File Structure
Copyweather-dashboard-app/
│
├── index.html          # Main dashboard page
├── tables.html         # Detailed weather table and chatbot page
├── styles.css          # Stylesheet for both pages
├── script.js           # JavaScript for index.html
├── tables-script.js    # JavaScript for tables.html
├── logo.png            # App logo
└── README.md           # This file
Contributing
Contributions to improve the app are welcome. Please follow these steps:

Fork the repository
Create a new branch (git checkout -b feature-branch)
Make your changes and commit (git commit -am 'Add some feature')
Push to the branch (git push origin feature-branch)
Create a new Pull Request

License
MIT License
Contact
Your Name - [your-email@example.com]
Project Link: https://github.com/yourusername/weather-dashboard-app