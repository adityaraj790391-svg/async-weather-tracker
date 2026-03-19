var MAP_KEY = "MjOZ3oPeb3fZHxhRX4QN";
maptilersdk.config.apiKey = MAP_KEY;

var map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: [78.9629, 22.5],
  zoom: 3,
});

var marker = null;


var API_KEY = "03c3d9e514cbb4b402100a6d028f7d1d";

function getWeather() {
  var cityInput = document.getElementById("cityInput");
  var city = cityInput.value;

  if (city === "") {
    alert("Please enter city name!");
    return;
  }

var url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+API_KEY +"&units=metric";

fetch(url).then(function(response) {
      return response.json();
})
.then(function(data) {
  if (data.cod === "404") {
    document.getElementById("errorMsg").textContent = "City not found";
    document.getElementById("errorMsg").style.display = "block";
     document.getElementById("weatherCard").style.display = "none";
} else {
   document.getElementById("errorMsg").style.display = "none";   
   document.getElementById("cityName").textContent = data.name + ", " + data.sys.country;
   document.getElementById("description").textContent = data.weather[0].description;
        
var temp = Math.round(data.main.temp);
document.getElementById("temp").textContent = temp + "°C";
        
var humidity = data.main.humidity;
document.getElementById("humidity").textContent = humidity + "%";
        
var wind = data.wind.speed;
document.getElementById("wind").textContent = wind + " m/s";

var precipitation = 0;
if (data.rain !== undefined) {
precipitation = data.rain["1h"];
} else if (data.snow !== undefined) {
  precipitation = data.snow["1h"];
}

document.getElementById("precipitation").textContent = precipitation + " mm";

var feels = Math.round(data.main.feels_like);
document.getElementById("feels").textContent = feels + "°C";
document.getElementById("weatherCard").style.display = "block";

saveHistory(data.name);


var lat = data.coord.lat;
var lon = data.coord.lon;

map.flyTo({ center: [lon, lat], zoom: 10 });

if (marker) marker.remove();

marker = new maptilersdk.Marker({ color: "#f16d34" })
  .setLngLat([lon, lat])
  .setPopup(new maptilersdk.Popup().setHTML("<b>" + data.name + "</b>"))
  .addTo(map);

 marker.togglePopup();
}
})
.catch(function(error) {
  document.getElementById("errorMsg").textContent = "Something went wrong.";
      document.getElementById("errorMsg").style.display = "block";
    });
}


function saveHistory(city) {
  var historyString = localStorage.getItem("history");
  var historyArray = [];
  
  if (historyString !== null) {
    historyArray = JSON.parse(historyString);
}


var newHistory = [];
for (var i = 0; i < historyArray.length; i++) {
  if (historyArray[i] !== city) {
      newHistory.push(historyArray[i]);
  }
}

newHistory.unshift(city);
if (newHistory.length > 5) {
    newHistory.pop();
}

localStorage.setItem("history", JSON.stringify(newHistory));
  showHistory();
}

function showHistory() {
  var historyString = localStorage.getItem("history");
  var historyArray = [];
  
if (historyString !== null) {
    historyArray = JSON.parse(historyString);
}

var historyList = document.getElementById("historyList");
historyList.innerHTML = "";

for (var i = 0; i < historyArray.length; i++) {
    var city = historyArray[i];
    var button = document.createElement("button");
    button.textContent = city;
    
    button.onclick = function() {
      document.getElementById("cityInput").value = this.textContent;
      getWeather();
    };

    historyList.appendChild(button);
  }
}

var cityInputElement = document.getElementById("cityInput");
cityInputElement.addEventListener("keydown", function(event) {
  if (event.code === "Enter") {
    getWeather();
  }
});

showHistory();



