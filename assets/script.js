var searchForm = document.getElementById("searchForm");
var searchInput;
var searchHistory = $("#searchHistory");
var weatherResults = $("#weatherResults");
var apiKey = "179a5a9fddd258890055139a6680139c";

var recentExplorations = JSON.parse(localStorage.getItem("recentExplorations")) || [];

function processSearch(event) {
  event.preventDefault();

  searchInput = document.getElementById("searchInput").value;

  localStorage.setItem("recentexplorations", JSON.stringify(recentExplorations));

    var coordinatesUrl =
      `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${apiKey}`;
  
    fetch(coordinatesUrl)
      .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })
          .then(function (data) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;

            var weatherUrl =
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            
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

function saveHistory() {
    if(recentExplorations.length > 5) {
        recentExplorations.pop();
    };

    for(i = 0; i < recentExplorations.length; i++) {
        $(`#searchHistory`).append(recentExplorations[i]);
    }
};

function displayWeather(weatherResults) {
    $(`#currentCity`)
        .text(searchInput + "," + moment.unix(weatherResults.date).format("MM/DD/YYYY"))
        .append('<img src="http://openweathermap.org/img/wn/'+ weatherResults.current.weather[0].icon +'.png"/>');

        $(`#currentTemp`).text("Temp: " + weatherResults.current.temp);
        $(`#currentWind`).text("Wind Speed: " + weatherResults.current.windSpeed);
        $(`#currentHumidity`).text("Humidity: " + weatherResults.current.humidity + "%");

        for(i=0; i<5; i++) {

        }
}

searchForm.addEventListener('submit', processSearch)
