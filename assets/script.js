var searchForm = document.getElementById("searchForm");
var searchInput;
var searchHistory = $("searchHistory");
var weatherResults = $("weatherResults");
var apiKey = "179a5a9fddd258890055139a6680139c";

var recentExplorations = JSON.parse(localStorage.getItem("recentExplorations"));

function processSearch(event) {
  event.preventDefault();

  searchInput = document.querySelector("searchInput").value;

  localStorage.setItem("recentexplorations", JSON.stringify(recentExplorations));

    var coordinatesUrl =
      `https://api.openweathermap.org/geo/1.0/direct?q=${`searchInput`}&limit=1&appid=${`apiKey`}`;
  
    fetch(coordinatesUrl)
      .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
          .then(function (data) {
            var latitude = data[0].lat;
            var longitutue = data[0].lon;

            var weatherUrl =
                `https://api.openweathermap.org/data/2.5/forecast?lat=${`latitude`}&lon=${`longitude`}&appid=${`apiKey`}`;
            
              fetch(weatherUrl)
              .then(function (response) {
                if (!response.ok) {
                    throw response.json();
                }
                return response.json();
                })
                  .then(function (data) {
                    displayWeather(data);
                  });
            })
};


