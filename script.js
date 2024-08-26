let map;
let control;
let startMarker, endMarker;
let start, end;

function initMap() {
    map = L.map('map').setView([-15.8402, -70.0219], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', onMapClick);
}

function onMapClick(e) {
    if (!start) {
        start = e.latlng;
        startMarker = L.marker(start).addTo(map).bindPopup('Inicio').openPopup();
        document.getElementById('start-coords').textContent = `${start.lat.toFixed(4)}, ${start.lng.toFixed(4)}`;
    } else if (!end) {
        end = e.latlng;
        endMarker = L.marker(end).addTo(map).bindPopup('Llegada').openPopup();
        document.getElementById('end-coords').textContent = `${end.lat.toFixed(4)}, ${end.lng.toFixed(4)}`;
        Dijkstra();
    }
}

function Dijkstra() {
    if (control) {
        map.removeControl(control);
    }

    control = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: false,
        lineOptions: {
            styles: [{ color: 'red', opacity: 0.8, weight: 5 }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
    }).addTo(map);

    control.on('routesfound', function(e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        var distancia = (summary.totalDistance / 1000).toFixed(2);
        var tiempo = Math.round(summary.totalTime / 60);
        
        document.getElementById('route-info').innerHTML = 
            `<strong>Distancia total:</strong> ${distancia} km<br>
             <strong>Tiempo estimado:</strong> ${tiempo} minutos`;
    });
}

function resetPoints() {
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    if (control) map.removeControl(control);
    
    start = null;
    end = null;
    document.getElementById('start-coords').textContent = 'No seleccionado';
    document.getElementById('end-coords').textContent = 'No seleccionado';
    document.getElementById('route-info').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    document.getElementById('reset-button').addEventListener('click', resetPoints);
});