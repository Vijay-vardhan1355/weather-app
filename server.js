const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

const API_KEY = '43ca9571c1c01bcf4c481061e947099e';

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
    const { city, lat, lon } = req.query;
    let weatherData = null;
    let forecastData = [];

    try {
        if (city) {
            const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            weatherData = formatWeatherData(weatherRes.data);

            const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
            forecastData = formatForecastData(forecastRes.data.list);
        } else if (lat && lon) {
            const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            weatherData = formatWeatherData(weatherRes.data);

            const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            forecastData = formatForecastData(forecastRes.data.list);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }

    res.render("index", { weather: weatherData, forecast: forecastData });
});

function formatWeatherData(data) {
    return {
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        lat: data.coord.lat,
        lon: data.coord.lon
    };
}

function formatForecastData(list) {
    const daily = {};
    list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) {
            daily[date] = {
                date: date,
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        }
    });
    return Object.values(daily).slice(0, 5);
}

app.listen(3000, () => console.log("Server running on port 3000"));
