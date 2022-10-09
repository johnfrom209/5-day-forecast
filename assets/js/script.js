var searchBtnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
var cityNameEl = $("#cityTitle");
var cityTempEl = $("#cityTemp");
var cityWindEl = $("#cityWind");
var cityHumidEl = $("#cityHumidity");
var searchListEl = $(".btnList")
// var dailyDateEl = $("#dailyDate");
var dayIcon = $("#dailyIcon");
//count for search button, limit it to 5
var count = 0;
var displayTime = moment().format("L");

var lat;
var lon;

function fetchResults(event) {
    event.preventDefault()

    searchInputEl = $("#searchInput").val();

    if (!searchInputEl) {

        return;
    }
    else {
        searchApi(searchInputEl);
    }
}

function searchApi(city) {

    //enables the border around the display
    $(".mainDisplay").removeClass("border-0");

    //clear the forecast
    $(".daysForecast").empty();


    var apiCall = 'http://api.openweathermap.org/geo/1.0/direct?q='
        + city + '&appid=6bd526cc976e4af732965c42955fed55'

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

                    addSearchBtn(data.city.name);

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
                        var daysEl = $("<div>", { "class": "card bg-secondary text-white cardForecast" });

                        var daysBody = $("<div>", { "class": "card-body" });
                        // var daysDate = $("<h5>", { "class": "card-title"})

                        //grab code from data
                        // use moment to display the date
                        displayTime = moment().add(i + 1, 'd').format("L");
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

function addSearchBtn(city) {
    //if btn.searchCity is less than 5 create ele btn
    var hold = $(".cityBtn");

    if (hold.length < 5) {
        var temp = $("<button>", { "class": "cityBtn btn btn-secondary m-3 col-8 " })
        temp.attr("data-city", city);
        temp.text(city);
        $(".btnList").append(temp);

        //save to LS
        saveBtnToLS(city);

    }
    else {
        //jquery for list of .cityBtn and replace at count index

        $(".cityBtn").each(function (index) {
            if (index == count) {
                $(this).attr("data-city", city);
                $(this).text(city);
            }
        });
        // [count].attr("data-city", city);
        // $(".cityBtn")[count].val(city);

        //save to LS
        //first we grab LS
        var cityArray = [];
        cityArray = JSON.parse(localStorage.getItem("Cities"));

        //overwrite the save that is index==count
        cityArray[count] = city;

        //save new array to LS
        localStorage.setItem("Cities", JSON.stringify(cityArray));

        count += 1;
    };

    if (count == 5) {
        count = 0;
    }
}

function saveBtnToLS(city) {
    var storedCity = [];
    // = JSON.parse(localStorage.getItem("Cities"));
    //if empty
    if (JSON.parse(localStorage.getItem("Cities")) === null) {
        storedCity.push(city);
    }
    else {
        storedCity = JSON.parse(localStorage.getItem("Cities"));
        storedCity.push(city);
    }
    //save to LS
    localStorage.setItem("Cities", JSON.stringify(storedCity));
}

function loadBtnfromLS() {

    if (JSON.parse(localStorage.getItem("Cities")) === null) {
        return;
    }
    else {
        //get the data and loop the to display the btn
        var tempArray = [];
        tempArray = JSON.parse(localStorage.getItem("Cities"));

        for (var i = 0; i < tempArray.length; i++) {
            addSearchBtn(tempArray[i]);
        }
    }
}

//this is the parent class where the search buttons append to
// this waits for a click inside of the .cityBtn class to be clicked
searchListEl.on('click', '.cityBtn', function (event) {
    // using jquery to grab the text of the button and search the api with that
    searchApi($(this).text());
});

loadBtnfromLS();
searchBtnEl.on("click", fetchResults);

