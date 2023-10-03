var searchForm = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
var searchHistory = [];
var weatherResults = $("#weatherResults");
var apiKey = "179a5a9fddd258890055139a6680139c";

var recentExplorations =
  JSON.parse(localStorage.getItem("recentExplorations")) || [];

function processSearch(event) {
  event.preventDefault();
  var searchInputValue = searchInput.value.trim();

  if (!searchInputValue) {
    return;
  }

  saveHistory(searchInputValue);

  var coordinatesUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${apiKey}`;

  fetch(coordinatesUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(function (data) {
      var latitude = data[0].lat;
      var longitude = data[0].lon;

      var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      var futureWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      Promise.all([fetch(currentWeatherUrl), fetch(futureWeatherUrl)])
        .then(function (responses) {
          return Promise.all(
            responses.map(function (response) {
              if (!response.ok) {
                throw new Error("Weather data not available");
              }
              return response.json();
            })
          );
        })
        .then(function (results) {
          var currentWeatherData = results[0];
          var futureWeatherData = results[1].list;

          displayWeather(currentWeatherData, futureWeatherData);
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}

function saveHistory(searchInput) {
  if (searchHistory.length >= 5) {
    searchHistory.shift();
  }
  searchHistory.push(searchInput);
  localStorage.setItem("recentExplorations", JSON.stringify(searchHistory));

  displaySearchHistory();
}

function displaySearchHistory() {
  var historyList = $("#searchHistory");
  historyList.empty();
  searchHistory.forEach(function (searchItem) {
    historyList.prepend(`<li>${searchItem}</li>`);
  });
}

function displayWeather(currentWeatherData, futureWeatherData) {
  console.log(currentWeatherData, futureWeatherData);
  var currentCity = ${searchInput.value}, ${moment.unix(currentWeatherData.dt).format("MM/DD/YYYY")};
    .append(
      '<img src="http://openweathermap.org/img/wn/' +
        currentWeatherData.weather[0].icon +
        '.png"/>'
    );

    var currentTemp = Temp: ${currentWeatherData.main.temp}°C;
    var currentWind = Wind Speed: ${currentWeatherData.wind.speed}m/s;
    var currentHumidity = Humidity: ${currentWeatherData.main.humidity}%;
    $("#currentCity").text(currentCity);
    $("#currentTemp").text(currentTemp);
    $("#currentWind").text(currentWind);
    $("#currentHumidity").text(currentHumidity);

  $("#weatherResults").empty();
  for (var i = 0; i < futureWeatherData.length; i += 8) {
    var forecastDate = futureWeatherData[i].dt_txt;
    var temperature = futureWeatherData[i].main.temp;
    var humidity = futureWeatherData[i].main.humidity;
    var windSpeed = futureWeatherData[i].wind.speed;

    var forecastItem = `<div class="forecast-item">
                            <h3>${forecastDate}</h3>
                            <p>Temperature: ${temperature}°C</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                          </div>`;

    $("#weatherResults").append(forecastItem);
  }
}

searchForm.addEventListener("submit", processSearch);
displaySearchHistory();
