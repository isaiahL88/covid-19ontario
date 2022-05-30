var map = L.map('map').setView([51.2538, -85.3232], 5);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=bVQrYjaeW0airGBjsvFz', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

// getLocations();

//Live location info
async function getLocations() {
    //fetch location from URL
    const response = await fetch('https://murmuring-reef-58036.herokuapp.com/https://covid-19.ontario.ca/covid-19-ac-assets/data/locations.json');
    const data = await response.json();
    console.log('NEW LOACTION DATA OVER HERE');
    console.log(data);

    //Collect set of all cities in dataset
    var cities = new Set();
    data.forEach((entry) => {

        cities.add(entry.city);
    });

    // //create city dropdown
    // cities.forEach((city) => {
    //     //select dropwown-content div
    //     var dropdown = $('.dropdown-content');

    //     //create new button for this city
    //     const newSpan = document.createElement('span');
    //     const text = document.createTextNode(city);
    //     newSpan.appendChild(text);
    //     dropdown.append(newSpan);
    //     console.log(`button created for ${city}`);

    // });
}


//Used to map all the vaccination centers in one city
async function mapIt(city) {
    //fetch location from URL
    const response = await fetch('https://murmuring-reef-58036.herokuapp.com/https://covid-19.ontario.ca/covid-19-ac-assets/data/locations.json');
    const data = await response.json();
    console.log('NEW LOACTION DATA OVER HERE');
    console.log(data);

    console.log(city);

    data.forEach((entry) => {
        if (entry.city === city) {
            console.log("found a centre");
            L.marker(
                L.latLng(entry.latitude, entry.longitude)
            ).addTo(map);
            console.log(`Added entry ${entry.location_name} into map`);
        }
    })
}

//dropdown script
$(document).ready(function () {
    $(".default_option").click(function () {
        $(".dropdown ul").toggleClass("active");
    })

    $(".dropdown ul li").click(function () {
        var text = $(this).text();
        $(".default_option").text(text);
        $(".dropdown ul").removeClass("active");
        mapIt($(this).text());
    })

    $(".fas").click(() => {
        console.log("fas clicked")
        var cities = new Array();
        cities = $(".cities li");
        console.log(cities);
        //Citty in the search bar
        var searchCity = $(".search_field .input").val();
        console.log(searchCity);
        var found = false;
        Array.prototype.forEach.call(cities, (city) => {
            if (city.innerText == searchCity) {
                city.click();
                found = true;
            }
        });

        if (!found) {
            alert(`Unable to find city with name ${searchCity}`);
        }
    });
})