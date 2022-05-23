var map = L.map('map').setView([51.2538, -85.3232], 5);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=bVQrYjaeW0airGBjsvFz', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

var xTable = [];
var yTable = [];

var x = 43.651070;
var y = -79.347015;


//  xTable = getX();

// const marker = L.marker([0,0]).addTo(map);
// marker.setLatLng([xTable[0],xTable[1]]);

//  getX();

//L.marker(xTable[0]).addTo(map);

//  let newmarket = [44.05011, -79.466315];
//  console.log(newmarket);
// L.marker(newmarket).addTo(map);
// L.marker([xTable]).addTo(map);
getX();
//console.log(xTable);
//const marker = L.marker([0, 0]).addTo(map);
//L.marker(xTable).addTo(map);
//    for (let i = 0; i < 2; i++) {

//     }


/// L.marker([43.651070,  -79.347015]).addTo(map);

async function getX() {
    const response = await fetch('newlocations.csv');
    const data = await response.text();

    const table = data.split('\n').slice(1);
    table.forEach(row => {
        const columns = row.split(',');

        const xCoord = columns[1];
        const yCoord = columns[2];
        console.log(xCoord, yCoord);
        xTable.push(xCoord, yCoord);
        L.marker([xCoord, yCoord]).addTo(map);


    });
}

async function getY() {
    const response = await fetch('test2.csv');
    const data = await response.text();

    const table = data.split('\n').slice(1);
    table.forEach(row => {
        const columns = row.split(',');
        const yCoord = columns[12];
        console.log(yCoord);
        xTable.push(yCoord);

    });
}


getLocations();

//Live location info
async function getLocations() {
    //fetch location from URL
    const response = await fetch('https://murmuring-reef-58036.herokuapp.com/https://covid-19.ontario.ca/covid-19-ac-assets/data/locations.json');
    const data = await response.json();
    console.log('NEW LOACTION DATA OVER HERE');
    console.log(data);

    //add all localtions to map
    data.forEach((entry) => {
        L.marker(
            [entry.longitude, entry.latitude],
            {
                title: entry.location_name
            }
        ).addTo(map)
    })
}