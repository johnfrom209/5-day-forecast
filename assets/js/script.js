var searchBtnEl = $("#searchBtn");
var searchInputEl = $("#searchInput");
var cityNameEl = $("#cityTitle");
var cityTempEl = $("#cityTemp");


var lat;
var lon;

function fetchResults(event) {
    event.preventDefault()
    searchInputEl = $("#searchInput");
    var apiCall = 'http://api.openweathermap.org/geo/1.0/direct?q='
        + searchInputEl.val() + '&appid=6bd526cc976e4af732965c42955fed55'
    console.log(apiCall);
    console.log(searchInputEl.val());
    // var citySearch =  $("#searchInput").val();
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
            console.log(lat);
            lon = data[0].lon;
            console.log(lon);

            var weatherSearch = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=6bd526cc976e4af732965c42955fed55'
            console.log(weatherSearch);
            //now that we have a city name, lat, and lon we can get the details
            fetch(weatherSearch)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);



                });
        });



}


searchBtnEl.on("click", fetchResults);

// 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=6bd526cc976e4af732965c42955fed55' +
//'/?q=' + searchInputEl.val()
//https://api.openweathermap.org/data/3.0/onecall?lat= +lat + &lon= + lon +&appid=524901&appid=6bd526cc976e4af732965c42955fed55