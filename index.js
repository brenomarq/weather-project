import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = ""; // Here you must place your apikey

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
        console.log(result.data);
    } catch (error) {
        console.log("Deu erro :'(");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
