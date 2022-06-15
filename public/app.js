
console.log("hello, this is app.js")


//Used to determine how many months of data to show in charts
var chartSize = 6;

function smallDisplay() {
    chartSize = 1;
    //add amount of months of data being visualized
    $(".months").text("" + chartSize);
    console.log("SMALL DISPLAY");
}

function medDisplay() {
    charSize = 2;
    //add amount of months of data being visualized
    $(".months").text("" + chartSize);
    console.log("MEDIUM DISPLAY");
}

function bigDispaly() {
    chartSize = 6;
    //add amount of months of data being visualized
    $(".months").text("" + chartSize);
    console.log("BIG DISPLAY");
}

//Used to Resize Chart size
var bounds = [
    { min: 0, max: 700, func: smallDisplay },
    { min: 701, max: 1000, func: medDisplay },
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

//All Chartjs Charts
//declared null so event listener knows if a chart has already been rendered
var caseChart = null;
var testChart = null;
var vacPie = null;
var booster1_pie = null;
var booster2_pie = null;
var hosp_bar = null;
var hosp_bar_daily = null;
var icu_bar = null;
var death_cumulative_bar = null;

/* renders all case info */
async function chartItC() {
    const data = await getCaseData();
    const ctx = document.getElementById('myChartC').getContext('2d');
    caseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Daily cases in Ontario',
                data: data.cases,
                backgroundColor: '#5175e0a8',
                borderColor: '#5175e0a8',
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

//Used to Retreive Case Data
async function getCaseData() {

    //Get a url to fetch data based on how big the viewport is
    var covidURL = getReleventURL();

    var cases = [];
    var dateAdmin = [];
    var total_cases = [];

    const response = await fetch(covidURL);
    const covid = await response.json();
    const data = await covid.data;

    //push all needed case data to repective arrays
    for (var i = 0; i < covid.data.length; i++) {
        //DAILY CASE DATA
        cases.push(data[i].cases_daily);

        //ACTIVE CASE DATA
        //NOT USED
        total_cases.push(data[i].cases);

        //DATE DATA
        dateAdmin.push(data[i].date);
    }

    return { cases, dateAdmin };
}


/* renders all test data */
async function chartItT() {
    const data = await getTestData();
    const ctx = document.getElementById('myChartT').getContext('2d');

    //Animation code
    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    testChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Daily COVID-19 Tests',
                data: data.aTest,
                backgroundColor: '#5175e0a8',
                borderColor: '#5175e0a8',
                borderWidth: 1
            }]
        },
        options: {
            animation,
            scales: {
                x: {
                    type: 'linear'
                }
            },
        }
    });
}

//Used to retrieve Test data
async function getTestData() {
    //Get a url to fetch data based on how big the viewport is
    var covidURL = getReleventURL();

    //Arrays to hold data
    var aTest = [];
    var dateAdmin = [];

    //simple await statements for fetching data from covidURL
    const response = await fetch(covidURL);
    const tests = await response.json();
    const data = await tests.data;

    //Go through each entry in data and push them to respective arrays
    for (var i = 0; i < tests.data.length; i++) {
        aTest.push(data[i].tests_completed_daily);
        dateAdmin.push(data[i].date);
    }

    return { aTest, dateAdmin };
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
                        data: data.vac_pie,
                        backgroundColor: ["#5175e0a8", "#dde2f1"],
                        borderWidth: 1
                    }]
                },
                hoverOffset: 4
            });

            //Create Booster1 Pie Diagram
            const ctx_b1 = document.getElementById("booster-1").getContext("2d");
            button1_pie = new Chart(ctx_b1, {
                type: "pie",
                data: {
                    labels: ['with booster-1', "without booster-1"],
                    datasets: [{
                        label: 'Population of Ontario with Booster-1',
                        data: data.booster1_pie,
                        backgroundColor: ["#5175e0a8", "#dde2f1"],
                        borderWidth: 1
                    }]
                },
                hoverOffset: 4
            });

            //Create Booster2 Pie Diagram
            const ctx_b2 = document.getElementById("booster-2").getContext("2d");
            button2_pie = new Chart(ctx_b2, {
                type: "pie",
                data: {
                    labels: ["with booster-2", "without booster-2"],
                    datasets: [{
                        label: 'Population of Ontario with Booster-2',
                        data: data.booster2_pie,
                        backgroundColor: ["#5175e0a8", "#dde2f1"],
                        borderWidth: 1
                    }]
                },
                hoverOffset: 4
            })
        });
}

async function getVacData() {
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

    //calculate booster 1 pie data
    var booster1 = dataON.total_boosters_1;
    var no_booster1 = ONData.population - booster1;

    //calculate booster 2 pie data
    var booster2 = dataON.total_boosters_2;
    var no_booster2 = ONData.population - booster2;


    //SETTING THE LABEL WITH UPDATED TOTAL POPULATION VALUES

    //set total_vacinated label
    $("#total_vac").text(vaccinated.toLocaleString("en-US"));

    //set total_boster1 label
    $("#total_booster1").text(booster1.toLocaleString("en-US"));

    //set total_booster2 label
    $("#total_booster2").text(booster2.toLocaleString("en-US"));

    return { vac_pie: [vaccinated, unvacinated], booster1_pie: [booster1, no_booster1], booster2_pie: [booster2, no_booster2] };
}

//RETREIVE HOSPITALIZATION DATA
async function getHospData() {
    //Get a url to fetch data based on how big the viewport is
    var url = getReleventURL();

    //fetch data from url
    const response = await fetch(url);
    const covid = await response.json();
    const data = await covid.data;

    //arrays to hold data
    var hosp_data = [];
    var dateAdmin = [];
    var hosp_data_daily = [];
    var icu = [];

    //GO through each entry in data and push to respective arrays
    for (var i = 0; i < data.length; i++) {
        //ACTIVE HOSPITALIZTION DATA
        hosp_data.push(data[i].hospitalizations);

        //DAILY HOSPITALIZATION DATA
        hosp_data_daily.push(data[i].hospitalizations_daily);

        //DATE DATA
        dateAdmin.push(data[i].date);

        //ICU DATA
        icu.push(data[i].icu);
    }

    return { hosp_data, dateAdmin, hosp_data_daily, icu };
}

//Chart Hosp Data
async function chartItH() {
    //wait for data
    const data = await getHospData();
    const ctx = document.getElementById('myChartH').getContext('2d');

    //Hospitilization bar chart
    hosp_bar = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Active Hospitalizations',
                data: data.hosp_data,
                borderColor: "#5175e0a8",
                backgroundColor: "#5175e0a8"
            }]
        },
        option: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Active Hospitalization"
                }
            }
        }
    });

    //Daily Hospitalization bar chart
    const ctx2 = document.getElementById('myChartHDaily').getContext('2d');
    hosp_bar_daily = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Daily Hospitalization',
                data: data.hosp_data_daily,
                borderColor: "#5175e0a8",
                backgroundColor: "#5175e0a8"
            }]
        },
        option: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Daily Hospitalization"
                }
            }
        }
    });

    //ICU patients bar chart
    const ctx3 = document.getElementById("icuChart").getContext("2d");
    icu_bar = new Chart(ctx3, {
        type: "bar",
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Active ICU Patients',
                data: data.icu,
                borderColor: "#5175e0a8",
                backgroundColor: "#5175e0a8"
            }]
        },
        option: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Daily Hospitalization"
                }
            }
        }
    });
}

//Chart Death Data
async function chartItD() {
    const data = await getDeathData();
    const ctx = document.getElementById("cumulative_death_chart").getContext("2d");

    death_cumulative_bar = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.dateAdmin,
            datasets: [{
                label: 'Cumulative Deaths',
                data: data.deaths,
                borderColor: "#5175e0a8",
                backgroundColor: "#5175e0a8"
            }]
        },
        option: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Cumulative Deaths"
                }
            }
        }
    });

    console.log(data);
}

//Retreive Death data
async function getDeathData() {
    //temp hardcoded chart size
    var url = getReleventURL();

    //fetch data from url
    const response = await fetch(url);
    const covid = await response.json();
    const data = await covid.data;

    var dateAdmin = [];
    var deaths = [];

    for (var i = 0; i < data.length; i++) {
        deaths.push(data[i].deaths);

        dateAdmin.push(data[i].date);
    }
    return { deaths, dateAdmin };
}

//returns a url that can be used to get the last 'chartSize' months of data from opencovid api 
function getReleventURL() {
    //Get current date using browser
    const date = new Date();

    //to hold on/after date values for url
    var day; var month; var year;

    year = date.getFullYear();

    //Day is Hard Coded
    day = "01";
    console.log("month: " + date.getMonth())
    //calculate on or after month after chartSize dynamic adjustment
    if (date.getMonth() < chartSize) {
        var newMonth = 12 - (chartSize - (date.getMonth() + 1));
        year--;
    } else {
        var newMonth = Math.abs((date.getMonth() + 1 - chartSize) % 12);
    }

    month = formatDate(newMonth);

    //Used as a refernce to see what is the last day in the first month we will collect data from
    //so we know what day to start collecting from
    var refDate = new Date(year, newMonth + 1, 0);

    //if the first month of data doesn't have as many days as the current month
    if (refDate.getDate() < date.getDate()) {
        day = formatDate(refDate.getDate());
        //else the first month of data must have as many days as the current month
    } else {

        day = formatDate(date.getDate());
    }

    return `https://api.opencovid.ca/summary?loc=ON&after=${year}-${month}-${day}`;
}

//return a day/month as a string with added 0 if it is less then 10
function formatDate(i) {
    if (i >= 10) {
        return "" + i
    } else {
        return "0" + i;
    }
}


/* INTITIAL MENU POP-UP CODE */

//add amount of months of data being visualized
$(".months").text("" + chartSize);

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

//hide vac data
$(".vac-pies").toggleClass("hide");

//hide Hosp data
$(".hosp").toggleClass("hide");

//hide Hosp daily data
$(".hosp_daily").toggleClass("hide");

//hide icu
$(".icu").toggleClass("hide");

//hide death chart
$(".death_cumulative").toggleClass("hide");

/* TESTS POP-UP EVENT LISTENER */
test_button.addEventListener('click', () => {
    //toggle active button stlying
    test_button.classList.toggle("button_active");

    test.classList.toggle('hide');

    //check if Tests need to be rendered for first time
    if (testChart === null) {
        chartItT();
    }
})

/* CASES POP-UP EVENT LISTENER */
cases_button.addEventListener('click', () => {
    cases_button.classList.toggle("button_active");

    cases.classList.toggle('hide');

    //check if cases need to be rendered for the first time
    if (caseChart === null) {
        chartItC();
    }
})

/* Vac POP-UP EVENT LISTENER */
vac_button.addEventListener('click', () => {
    vac_button.classList.toggle("button_active");

    //fix for delay from proxy for vaccination 
    //doesn't reeally fix the problem
    if (vacPie === null) {
        chartItV();

        setTimeout(() => {
        }, 300);
    }

    //toggle active styling for vaccination pies
    $(".vac-pies").toggleClass("active");
    $(".vac-pies").toggleClass("hide");
})

//HOSP POP-UP EVENT LISTENER
$("#hosp_button").click(() => {
    //toggle hosp data
    $(".hosp").toggleClass("hide");
    $(".hosp_daily").toggleClass("hide");
    $(".icu").toggleClass("hide");

    //check if hosp data needs to rendered for the first time
    if (hosp_bar === null) {
        chartItH();
    }
});

//Death Cumulative POP-UP EVENT LISTENER
$("#deaths_chart_button").click(() => {
    //toggle chart
    $(".death_cumulative").toggleClass("hide");

    //Check if chart needs to be rendered for the first time
    if (death_cumulative_bar === null) {
        chartItD();
    }
})

