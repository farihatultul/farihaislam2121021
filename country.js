function start() {

    var searchTerm=document.getElementById("searchBox").value;
    
    if (searchTerm === "") {
        alert("Please enter a country name.");
        return;
    }

    var url=`https://restcountries.com/v3.1/name/${searchTerm}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {

            if (data){
                process(data);
            } else{
                document.getElementById("displayArea").innerHTML = "<p>DATA UNAVAILABLE.</p>";
            }
        });
}

function process(data) {
    var displayArea=document.getElementById("displayArea");
    displayArea.innerHTML= "";

    for (var i=0;i<data.length; i++) {
        var country=data[i];

        var card=document.createElement("div");
        card.className="country-card";

        var countryName=country.name.common;
      var  flagUrl=country.flags  && country.flags.png ? country.flags.png: "";
     var capital=country.capital && country.capital.length > 0 ? country.capital[0] : "UNAVAILABLE";
       var region=country.region || "UNAVAILABLE";
     var population=country.population || "UNAVAILABLE";
     var latlng=country.latlng;
     var currencies=country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "UNAVAILABLE";
     var languages= country.languages ? Object.values(country.languages).join(", ") : "UNAVAILABLE";
      var timezones= country.timezones ? country.timezones.join(", ") : "UNAVAILABLE";
     var mapUrl= country.maps && country.maps.googleMaps ? country.maps.googleMaps : "#";

        var weatherInfo=document.createElement("p");
        weatherInfo.innerHTML="Loading weather data...";

    
        card.innerHTML="<h2>" + countryName + "</h2>" +
                         "<img src='" + flagUrl + "' alt='Flag of " + countryName + "'>" +
                         "<p><strong>Capital:</strong> " + capital + "</p>" +
                         "<p><strong>Region:</strong> " + region + "</p>" +
                         "<p><strong>Population:</strong> " + population.toLocaleString() + "</p>";

        card.appendChild(weatherInfo);

  
        var detailsDiv=document.createElement("div");
        detailsDiv.className= "details";
        detailsDiv.innerHTML=
        "<p><strong>Currency:</strong> " + currencies + "</p>" +
        "<p><strong>Languages:</strong> " + languages + "</p>" +
        "<p><strong>Timezones:</strong> " + timezones + "</p>" +
        "<p><strong>Map:</strong> <a href='" + mapUrl + "' target='_blank'>Click to View on Google Maps.</a></p>";
        card.appendChild(detailsDiv);

        var moreButton=document.createElement("button");
         moreButton.className="more-button";
          moreButton.innerHTML="Click To See More Details";
         moreButton.onclick=function() {
            if (detailsDiv.style.display === "none" || detailsDiv.style.display === "") {
                detailsDiv.style.display = "block";
                moreButton.innerHTML="Click To Hide Details";
            } 
            else {
                detailsDiv.style.display = "none";
                moreButton.innerHTML = "More Details";
            }
        };

        card.appendChild(moreButton);

        displayArea.appendChild(card);

    
        if (latlng && latlng.length === 2) 
            {
            var lat = latlng[0];
            var lon = latlng[1];

            var weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=` + lat + `&longitude=` + lon + `&current_weather=true`;

            fetch(weatherUrl)
                .then(res => res.json())
                .then(weatherData => 
                    {
                        if (weatherData && weatherData.current_weather) {
                        var temperature = weatherData.current_weather.temperature;
                        var windspeed = weatherData.current_weather.windspeed;
                        weatherInfo.innerHTML = "<strong>Weather:</strong> " + temperature + "°C, " + windspeed + " km/h";
                    } 
                    
                    else {weatherInfo.innerHTML = "Weather data UNAVAILABLE.";}});
        }
    }
}
