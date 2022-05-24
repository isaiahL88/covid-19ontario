var map = L.map('map').setView([51.2538, -85.3232], 5);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=bVQrYjaeW0airGBjsvFz', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

getLocations();

//Live location info
async function getLocations() {
    //fetch location from URL
    const response = await fetch('https://murmuring-reef-58036.herokuapp.com/https://covid-19.ontario.ca/covid-19-ac-assets/data/locations.json');
    const data = await response.json();
    console.log('NEW LOACTION DATA OVER HERE');
    console.log(data);

    //add all localtions to map
    var i = 100;
    data.forEach((entry) => {
        if (i > 0) {

            L.marker(
                L.latLng(entry.latitude, entry.longitude)
            ).addTo(map);
            console.log(`Added entry ${entry.location_name} into map`);
        }
        i--;
    })
}