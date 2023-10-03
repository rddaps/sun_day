var searchForm = document.getElementById("searchForm");
var searchInput;
var searchHistory = [];
var weatherResults = $("#weatherResults");
var apiKey = "179a5a9fddd258890055139a6680139c";

var recentExplorations = JSON.parse(localStorage.getItem(["searchHistory"]));
localStorage.setItem("recentExplorations", JSON.stringify(searchHistory));

function processSearch(event) {
  event.preventDefault();

  searchInput = document.getElementById("searchInput").value;
  saveHistory(searchInput);

  var coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${apiKey}`;

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

      var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      var futureWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      fetch(currentWeatherUrl)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(function (currentWeatherData) {
          displayWeather(currentWeatherData);
        });

      fetch(futureWeatherUrl)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(function (response) {
          var forecastData = response.list;
        });
        
    });
}

function saveHistory(searchInput) {
  if (searchHistory > 5) {
    searchHistory.pop();
    var recentExplorations = `<li>${searchInput}</li>`;
    $("#searchHistory").append(recentExplorations);
  }

  $("#searchHistory").on("click", "li", function () {
    var searchInput = $(this).text();
    displayWeather(searchInput);
  });
}

function displayWeather(weatherResults) {
  console.log(weatherResults);
  $(`#currentCity`)
    .text(
      searchInput + ", " + moment.unix(weatherResults.dt).format("MM/DD/YYYY")
    )
    .append(
      '<img src="http://openweathermap.org/img/wn/' +
        weatherResults.weather[0].icon +
        '.png"/>'
    );

  $(`#currentTemp`).text("Temp: " + weatherResults.main.temp + "°C");
  $(`#currentWind`).text("Wind Speed: " + weatherResults.wind.speed + "m/s");
  $(`#currentHumidity`).text("Humidity: " + weatherResults.main.humidity + "%");

  for (var i = 1; i < forecastData.length; i+= 8) {
    var forecastDate = forecastData[i].dt_txt;
    var temperature = forecastData[i].main.temp;
    var humidity = forecastData[i].main.humidity;
    var windSpeed = forecastData[i].wind.speed;

    var forecastItem = `<div class="forecast-item">
                            <h3>${forecastDate}</h3>
                            <p>Temperature: ${temperature}°C</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                          </div>`;

    $("#weather-info").append(forecastItem);
  }
}

searchForm.addEventListener("submit", processSearch);
