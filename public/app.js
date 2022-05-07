console.log("hello, this is app.js")
function navSlider() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    burger.addEventListener('click', () => {
        //Toggle Nav
        nav.classList.toggle('nav-active');
    });

}

navSlider();

var totalVacc = 0;
var totalCS = 0;
//Get current date using browser
const date = new Date();
//changed to only record past 6 months
console.log(`day: ${date.getDate()}, month: ${date.getMonth()}`);
var day; var month;
if (date.getDate() < 10) {
    day = "0" + date.getDate();
} else {
    day = "" + date.getDate();
}
var newMonth = Math.abs((date.getMonth() - 6) % 12);
if (newMonth < 10) {
    month = "0" + newMonth;
} else {
    month = "" + newMonth;
}

var covidURL = `https://api.opencovid.ca/summary?loc=ON&after=${date.getFullYear()}-${month}-${day}`;
console.log("FETCHING FROM URL: " + covidURL);

//Used to be used to chart daily vaccination data
// chartItV();

chartItT();
chartItC();
async function chartItC() {
    const data = await getCaseData();
    const ctx = document.getElementById('myChartC').getContext('2d');
    const myChart = new Chart(ctx, {
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
// async function chartItV() {
//     const data = await getVaccData();
//     const ctx = document.getElementById('myChartV').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: data.dateAdmin,
//             datasets: [{
//                 label: 'Daily COVID-19 Vaccine doses admistered in Ontario',
//                 data: data.aVacc,
//                 backgroundColor: '#1c42aab2',
//                 borderColor: '#1c42aab2',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         callback: function (value, index, values) {
//                             return value;
//                         }
//                     }
//                 }]
//             },
//             responsive: true
//         }
//     });
// }

async function chartItT() {
    const data = await getTestData();
    const ctx = document.getElementById('myChartT').getContext('2d');
    const myChart = new Chart(ctx, {
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

async function getTestData() {
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

// !Waiting for api to return vaccine vars!
// async function getVaccData() {
//     var aVacc = [];
//     var dateAdmin = [];
//     var temp;
//     const response = await fetch(covidURL);
//     const data = await response.json();
//     console.log(data.summary);
//     for (var i = 0; i < data.data; i++) {
//         temp = data.data[i].date;
//         aVacc.push(data[i].avaccine);
//         dateAdmin.push(formatMonth(temp));
//         // document.getElementById('totalFV').textContent = data.summary[i].cumulative_cvaccine;
//     }
//     return { aVacc, dateAdmin };
// }
async function getCaseData() {
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