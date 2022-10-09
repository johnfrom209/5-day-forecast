var searchBtnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
var cityNameEl = $("#cityTitle");
var cityTempEl = $("#cityTemp");
var cityWindEl = $("#cityWind");
var cityHumidEl = $("#cityHumidity");
// var dailyDateEl = $("#dailyDate");
var dayIcon = $("#dailyIcon");

var displayTime = moment().format("L");

var lat;
var lon;

function fetchResults(event) {
    event.preventDefault()
    searchInputEl = $("#searchInput");
    var apiCall = 'http://api.openweathermap.org/geo/1.0/direct?q='
        + searchInputEl.val() + '&appid=6bd526cc976e4af732965c42955fed55'

    if (!searchInputEl.val()) {
        alert("Please enter a city");
        return;
    }

    //look for city with the search
    fetch(apiCall)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            //grab the lat and log of the city
            lat = data[0].lat;
            lon = data[0].lon;

            var weatherSearch = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=6bd526cc976e4af732965c42955fed55'

            //now that we have a city name, lat, and lon we can get the details
            fetch(weatherSearch)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                    var currentDate = $("<span>", { "class": "card-title" })
                    currentDate.text(" (" + displayTime + ") ");
                    cityNameEl.text(data.city.name);

                    // cityNameEl.append(currentDate);
                    var iconCode = data.list[0].weather[0].icon;
                    var dailyUrl = "http://openweathermap.org/img/w/" + iconCode + ".png"

                    var dayIcon = $("<img>", { "src": dailyUrl });
                    dayIcon.attr("lt", "Weather Icon");

                    cityNameEl.append(currentDate).append(dayIcon);
                    cityTempEl.text(data.list[0].main.temp + " F");
                    cityWindEl.text(data.list[0].wind.speed + " MPH");
                    cityHumidEl.text(data.list[0].main.humidity + " %");

                    //next need to grab the next 5 days
                    //api offers data sets every 3 hour
                    //every 9th is 24h, so index 8

                    $("#forecastText").text("5 Day Forecast");

                    for (var i = 0; i < 5; i++) {
                        var index = 8;

                        //grab the settings and create the elements
                        var daysEl = $("<div>", { "class": "card bg-dark text-white col-2 d-inline-block" });

                        var daysBody = $("<div>", { "class": "card-body" });
                        // var daysDate = $("<h5>", { "class": "card-title"})

                        //in the process of trying to display the next 5 days
                        var daysImage = $("<h6>", { "class": "card-subtitle mb-2" });

                        //grab code from data
                        // use moment to display the date
                        displayTime = moment().add(i + 1, 'd');
                        var forecastDateEl = $("<h5>", { "class:": "card-title" });
                        forecastDateEl.text(displayTime);

                        //grab the icon from data
                        var daysIconCode = data.list[index].weather[0].icon;
                        var daysIconUrl = "http://openweathermap.org/img/w/" + daysIconCode + ".png";
                        var daysIcon = $("<img>", { "src": daysIconUrl });
                        daysIcon.attr("alt", "Weather icon");

                        // create h6 and display the temp
                        var daysTemp = $("<h6>", { "class": "card-subtitle mb-2" });
                        daysTemp.text(data.list[index].main.temp + " F");
                        // display the wind speed
                        var daysWind = $("<h6>", { "class": "card-subtitle mb-2" });
                        daysWind.text(data.list[index].wind.speed + " MPH");
                        // display the humidity
                        var daysHumid = $("<h6>", { "class": "card-subtitle mb-2" });
                        daysHumid.text(data.list[index].main.humidity + " %");

                        // append that a card
                        daysBody.append(forecastDateEl, daysIcon, daysTemp, daysWind, daysHumid)
                        // append card to daysEl
                        daysEl.append(daysBody);
                        $(".daysForecast").append(daysEl);
                        index += 8;

                        //increment time for moment

                    }

                });
        });



}


searchBtnEl.on("click", fetchResults);

// 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=6bd526cc976e4af732965c42955fed55' +
//'/?q=' + searchInputEl.val()
//https://api.openweathermap.org/data/3.0/onecall?lat= +lat + &lon= + lon +&appid=524901&appid=6bd526cc976e4af732965c42955fed55