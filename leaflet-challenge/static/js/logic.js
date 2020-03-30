var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log(API_quakes)
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(plates)

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var plateBound = new L.LayerGroup();

d3.json(plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'lightpink'
            }
        },
    }).addTo(plateBound);
})


function Color(magnitude) {
    if (magnitude > 5) {
        return 'black'
    } else if (magnitude > 4) {
        return 'darkgreen'
    } else if (magnitude > 3) {
        return 'mediumblue'
    } else if (magnitude > 2) {
        return 'magenta'
    } else if (magnitude > 1) {
        return 'yellow'
    } else {
        return 'cyan'
    }
};

function createMap() {

    var sat = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiYWZjdW1taW5ncyIsImEiOiJjazZ4cmNndnUwajFqM2xydjFkcWY4dWQwIn0.2OFwp83D_c5khNEzLIgDlQ'
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYWZjdW1taW5ncyIsImEiOiJjazZ4cmNndnUwajFqM2xydjFkcWY4dWQwIn0.2OFwp83D_c5khNEzLIgDlQ'
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoiYWZjdW1taW5ncyIsImEiOiJjazZ4cmNndnUwajFqM2xydjFkcWY4dWQwIn0.2OFwp83D_c5khNEzLIgDlQ'
    });



    var baseLayers = {
        "Satellite": sat,
        "Street": streetMap,
        "Dark": darkMap,
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": plateBound,
    };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 4.3,
        layers: [streetMap, earthquakes, plateBound]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);


    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}
