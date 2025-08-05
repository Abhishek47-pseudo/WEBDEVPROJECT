
const map = L.map('disaster-map').setView([22.5, 78.9], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CartoDB',
    maxZoom: 19
}).addTo(map);


const customIcon = L.icon({
    iconUrl: 'imgs/disater_pin.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


fetch("map_data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector("#data-table tbody");

        data.forEach(item => {
            const { image_name, latitude, longitude, timestamp, predicted_labels } = item;

            const readableLabels = predicted_labels.map(label => {
                return label
                    .replace(/_/g, " ")                       // snake_case to words
                    .replace(/\b(any|affected|damage|structures)\b/gi, match => {
                        switch (match.toLowerCase()) {
                            case "any": return "(present)";
                            case "affected": return "(damaged)";
                            case "damage": return "(with damage)";
                            case "structures": return "(structures affected)";
                            default: return match;
                        }
                    })
                    .replace(/\b\w/g, c => c.toUpperCase());  
            });

            const popupContent = `
    <strong>${image_name}</strong><br/>
    <b>Time:</b> ${timestamp}<br/>
    <b>Labels:</b> ${readableLabels.join(", ")}
  `;

            const marker = L.marker([latitude, longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(popupContent);

            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${timestamp}</td>
    <td>${latitude.toFixed(2)}</td>
    <td>${longitude.toFixed(2)}</td>
    <td>${readableLabels.join(", ")}</td>
  `;

            row.addEventListener("click", () => {
                map.setView([latitude, longitude], 10);
                marker.openPopup();
            });

            tableBody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error loading map_data.json:", err);
    });
