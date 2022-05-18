console.log("hello, this is app.js")
function navSlider() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    burger.addEventListener('click', () => {
        //Toggle Nav
        nav.classList.toggle('nav-active');
        console.log('burger clicked');

        //Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
            }

        });

        //Burger Animation
        burger.classList.toggle('toggle');

    });


}

navSlider();


//Used to determine how many months of data to show in charts
var chartSize = 6;

function smallDisplay() {
    chartSize = 0;
    console.log("SMALL DISPLAY");
}

function medDisplay() {
    charSize = 2;
    console.log("MEDIUM DISPLAY");
}

function bigDispaly() {
    chartSize = 6;
    console.log("BIG DISPLAY");
}

//Used to Resize Chart size
var bounds = [
    { min: 0, max: 700, func: smallDisplay },
    { min: 0, max: 1000, func: medDisplay },
    { min: 1001, max: Number.MAX_VALUE, func: bigDispaly },
];

var resizeFn = function () {
    var lastBoundry; // cache the last boundry used
    return function () {
        var width = window.innerWidth;
        var min, max;
        for (var i = 0; i < bounds.length; i++) {
            boundry = bounds[i];
            min = boundry.min || Number.MIN_VALUE;
            max = boundry.max || Number.MAX_VALUE;
            if (width > min && width < max
                && lastBoundry !== boundry) {
                lastBoundry = boundry;
                return boundry.func.call(boundry);
            }
        }
    }
};

$(window).resize(resizeFn());
$(document).ready(function () {
    $(window).trigger('resize');
});



var totalVacc = 0;
var totalCS = 0;

var caseChart = null;
var testChart = null;
var vacPie = null;

/* renders all case info */
async function chartItC() {
    //Get current date using browser
    const date = new Date();
    //Adjust Amount of Data in Chart
    console.log(`day: ${date.getDate()}, month: ${date.getMonth()}`);
    var day; var month;
    if (date.getDate() < 10) {
        day = "0" + date.getDate();
    } else {
        day = "" + date.getDate();
    }
    var newMonth = Math.abs((date.getMonth() - chartSize) % 12);
    if (newMonth < 10) {
        month = "0" + newMonth;
    } else {
        month = "" + newMonth;
    }

    var covidURL = `https://api.opencovid.ca/summary?loc=ON&after=${date.getFullYear()}-${month}-${day}`;
    console.log("FETCHING FROM URL: " + covidURL);

    const data = await getCaseData();
    const ctx = document.getElementById('myChartC').getContext('2d');
    caseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Daily cases in Ontario',
                data: data.cases,
                backgroundColor: '#1c42aab2',
                borderColor: '#1c42aab2',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value;
                        }
                    }
                }]
            },
            responsive: true
        }
    });
}

/* renders all test data */
async function chartItT() {
    const data = await getTestData();
    const ctx = document.getElementById('myChartT').getContext('2d');
    testChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Daily COVID-19 Vaccine Tests',
                data: data.aTest,
                backgroundColor: '#1c42aab2',
                borderColor: '#1c42aab2',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value;
                        }
                    }
                }]
            },
            responsive: true
        }
    });
}

/* render vaccination data */
const trackURL = "https://murmuring-reef-58036.herokuapp.com/https://api.covid19tracker.ca/summary/split";
const provURL = "https://murmuring-reef-58036.herokuapp.com/https://api.covid19tracker.ca/provinces"
async function chartItV() {
    const data = getVacData()
        .then((data) => {
            console.log("DATA: ");
            console.log(data);
            const ctx = document.getElementById('myPieV').getContext('2d');
            //Create Pie Diagram for Vaccinated Pplulation of Ontario
            vacPie = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['vaccinated', 'unvaccinated'],
                    datasets: [{
                        label: 'Vaccinated Population of Ontario',
                        data: data,
                        backgroundColor: ['#1c42aab2', '#8792B1'],
                        borderWidth: 1
                    }]
                },
                hoverOffset: 4
            })
        });
}

async function getVacData() {
    // const response = await fetch(trackURL);
    // const dataAll = await response.json();
    var dataAll = null;
    var dataON;
    fetch(trackURL)
        .then(res => res.json())
        .then(data => { dataAll = data })
        .then(() => {
            //find Ontario specific data
            dataAll.data.forEach(element => {
                if (element.province === "ON") {
                    dataON = element;
                }
            })
            console.log("Data For Ontario:");
            console.log(dataON);

        });
    const response = await fetch(provURL);
    const provData = await response.json();
    var ONData = null;
    //find ontario data
    provData.forEach(e => {
        if (e.code === 'ON') {
            ONData = e;
        }
    })
    console.log(ONData);
    //calculated unvacinated people
    var vaccinated = dataON.total_vaccinated;
    var unvacinated = ONData.population - vaccinated;
    return [vaccinated, unvacinated];
}

async function getTestData() {
    //Get current date using browser
    const date = new Date();
    //Adjust Amount of Data in Chart
    console.log(`day: ${date.getDate()}, month: ${date.getMonth() + 1}`);
    var day; var month; var year;
    console.log('THIS IS THE CURRENT DATE ' + date.getMonth());
    year = date.getFullYear();

    //Day is Hard Coded
    day = "01";

    //calculate on or after month after chartSize dynamic adjustment
    if (date.getMonth() < chartSize) {
        var newMonth = 12 - (chartSize - (date.getMonth() + 1));
        year--;
    } else {
        var newMonth = Math.abs((date.getMonth() + 1 - chartSize) % 12);
    }

    if (newMonth < 10) {
        month = "0" + newMonth;
    } else {
        month = "" + newMonth;
    }

    console.log("NEW MONTH: " + month);

    var covidURL = `https://api.opencovid.ca/summary?loc=ON&after=${year}-${month}-${day}`;
    console.log("FETCHING FROM URL: " + covidURL);

    var aTest = [];
    var dateAdmin = [];
    var temp;
    const response = await fetch(covidURL);
    const tests = await response.json();
    for (var i = 0; i < tests.data.length; i++) {
        temp = tests.data[i].date;
        aTest.push(tests.data[i].tests_completed_daily);
        dateAdmin.push(temp);
        // document.getElementById('totalFV').textContent = data.summary[i].cumulative_cvaccine;
    }
    return { aTest, dateAdmin };
}

async function getCaseData() {
    //Get current date using browser
    const date = new Date();
    //Adjust Amount of Data in Chart
    console.log(`day: ${date.getDate()}, month: ${date.getMonth()}`);
    var day; var month;
    if (date.getDate() < 10) {
        day = "0" + date.getDate();
    } else {
        day = "" + date.getDate();
    }
    var newMonth = Math.abs((date.getMonth() - chartSize) % 12);
    if (newMonth < 10) {
        month = "0" + newMonth;
    } else {
        month = "" + newMonth;
    }

    var covidURL = `https://api.opencovid.ca/summary?loc=ON&after=${date.getFullYear()}-${month}-${day}`;
    console.log("FETCHING FROM URL: " + covidURL);

    var cases = [];
    var dateAdmin = [];
    var temp;
    const response = await fetch(covidURL);
    const covid = await response.json();
    console.log(covid.data);
    for (var i = 0; i < covid.data.length; i++) {
        temp = covid.data[i].date;
        cases.push(covid.data[i].cases_daily);
        dateAdmin.push(temp);
        // document.getElementById('totalCS').textContent = data.summary[i].cumulative_cases;
    }
    return { cases, dateAdmin };

}
function formatMonth(str) {
    var month;
    switch (str.charAt(3) + str.charAt(4)) {
        case "01": month = "Jan"; break;
        case "02": month = "Feb"; break;
        case "03": month = "Mar"; break;
        case "04": month = "April"; break;
        case "05": month = "May"; break;
        case "06": month = "June"; break;
        case "07": month = "July"; break;
        case "08": month = "Aug"; break;
        case "09": month = "Sept"; break;
        case "10": month = "Oct"; break;
        case "11": month = "Nov"; break;
        case "12": month = "Dec"; break;
    }
    return month + " " + str.charAt(0) + str.charAt(1);
}

/* MENU POP-UP CODE */

/* select and hide test menu */
const test_button = document.querySelector("#test-button");
const test = document.querySelector(".tests");
test.classList.toggle("hide");

/* select and hide case menu */
const cases_button = document.querySelector('#cases-button');
const cases = document.querySelector('.cases');
cases.classList.toggle('hide');

/* select and hide vaccinations menu */
const vac_button = document.querySelector('#vac-button');
const vac = document.querySelector('.vac');
vac.classList.toggle('hide');

/* TESTS POP-UP EVENT LISTENER */
test_button.addEventListener('click', () => {
    console.log("Test button hit");
    if (test == null) return;
    test.classList.toggle('hide');
    if (testChart === null) {
        chartItT();
    }
})

/* CASES POP-UP EVENT LISTENER */
cases_button.addEventListener('click', () => {
    console.log("Cases menu button hit!!!");
    if (cases === null) return null;
    cases.classList.toggle('hide');
    if (caseChart === null) {
        chartItC();
    }
})

/* Vac POP-UP EVENT LISTENER */
vac_button.addEventListener('click', () => {
    console.log('vac button hit!!!');
    if (vac === null) {
        console.log("null vac div");
        return;
    }
    vac.classList.toggle('hide');
    if (vacPie === null) {
        chartItV();
    }
})

