const { response } = require("express");

var searchForm = $("searchForm");
var searchInput = $("searchInput");
var searchHistory = $("searchHistory");
var weatherResults = $("weatherResults");

var city = $("city");
var state = $("state");
var country = $("country");

function processSearch(event) {
  event.preventDefault();

  searchInput = document.querySelector("#searchInput").value;
}

searchForm.addEventListener("submit", function (e) {});

searchForm.addEventListener("submit", processSearch);

var searchInput = document.querySelector("searchInput").ariaValueMax;

function getWeather(city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
  );
}
var APIKey = "###";

var getCityCoordinates = function (city) {
  var coordinatesUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=2&appid=" +
    apiKey;

  fetch(coordinatesUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayCordinates(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to identify city");
    });
};

// function convertCityData(city) {
//     fetch('https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=2&appid=${apiKey}')
//     .then(response => response.json())
//     .then
// }
