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
          .then(function (currentWeatherData) {
            currentWeather(currentWeatherData);
            var latitude = currentWeatherData[0].lat;
            var longitude = currentWeatherData[0].lon;

            var weatherUrl =
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            
              fetch(weatherUrl)
              .then(function (response) {
                if (!response.ok) {
                    throw response.json();
                }
                return response.json();
                })
                  .then(function (futureWeatherData) {
                    displayWeather(currentWeatherData);
                    displayWeather(futureWeatherData);
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
        .text(searchInput + ", " + moment.unix(weatherResults.date).format("MM/DD/YYYY"))
        .append('<img src="http://openweathermap.org/img/wn/'+ weatherResults.current.weather[0].icon +'.png"/>');

        $(`#currentTemp`).text("Temp: " + weatherResults.current.temp);
        $(`#currentWind`).text("Wind Speed: " + weatherResults.current.windSpeed);
        $(`#currentHumidity`).text("Humidity: " + weatherResults.current.humidity + "%");

        for(i=0; i<5; i++) {

        var fiveDayOutlook = document.createElement("div")
        fiveDayOutlook.classList = "card col-5 mb-3 bg-primary text-light";
        $('#5DayOutlook').append(fiveDayOutlook);

        var fiveDayOutlookDate = moment.unix(weatherResults.daily[i].dt).format("MM/DD/YYYY")
        var eachDayEl = document.createElement("p");
        fiveDayOutlook.appendChild(eachDayEl).textContent = fiveDayOutlookDate;

        var fiveDayOutlookIcon = document.createElement("img");
        fiveDayOutlookIcon.setAttribute("src", "http://openweathermap.org/img/wn/"+ weatherResults.daily[i].weather[0].icon +".png")
        fiveDayOutlookIcon.classList = "w-25";
        fiveDayOutlook.appendChild(fiveDayOutlookIcon);

        var fiveDayOutlookTemp = weatherResults.daily[i].temp.day;
        var eachDayTempEl = document.createElement("p");
        fiveDayOutlook.appendChild(eachDayTempEl).textContent = 'Temp: ' + fiveDayOutlookTemp;

        var fiveDayOutlookWind = weatherResults.daily[i].wind_speed;
        var eachDayWindEl = document.createElement("p");
        fiveDayOutlook.appendChild(eachDayWindEl).textContent = 'Wind Speed: ' + fiveDayOutlookWind;

        var fiveDayOutlookHumidity = weatherResults.daily[i].humidity;
        var eachDayHumidity = document.createElement("p");
        fiveDayOutlook.appendChild(eachDayHumidity).textContent = 'Humidity: ' + fiveDayOutlookHumidity;

        }
}

searchForm.addEventListener('submit', processSearch)
