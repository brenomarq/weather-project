import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

// Important constant values
const app = express();
const port = 3000;
const GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "5ff5e0cc3da9488d211cabbdbd6c76af"; // Here you must place your apikey

// Used Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/search", async (req, res) => {
    const { search } = req.body;
    try {
        // This part makes the geocoding part, requesting the coordiantes of the location.
        const response = await axios.get(GEOCODE_URL,
            {params: {
                q: search,
                appid: apiKey,
                limit: 1,
            }});
        // This part makes the request of the weather forecast of the specified location.
        const result = await axios.get(FORECAST_URL,
            {params: {
                lat: response.data[0].lat,
                lon: response.data[0].lon,
                appid: apiKey,
                units: "metric",
            }});
        // Index.ejs is rendered back to the user with the requested information.
        res.render("index.ejs", {
            data: {
                country: response.data[0].country,
                city: response.data[0].name,
                temp: parseInt(result.data.main.temp),
                weather: result.data.weather[0].main,
                icon: result.data.weather[0].icon,
                hum: result.data.main.humidity,
                winspeed: result.data.wind.speed,
            }
        });
    } catch (error) {
        res.render("index.ejs", { error: error });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
