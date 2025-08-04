// Initialize map centered over India
const map = L.map('disaster-map').setView([22.5, 78.9], 5);

// Add base map layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & CartoDB',
    maxZoom: 19
}).addTo(map);

// Add zoom control to bottom right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Custom marker icon
const customIcon = L.icon({
    iconUrl: 'imgs/disaster_pin.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'marker-shadow.png',
    shadowSize: [41, 41]
});

// Load and display JSON data
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

            // 🧠 Convert labels to readable form
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
                    .replace(/\b\w/g, c => c.toUpperCase());  // Capitalize each word
            });

            // 📍 Popup content
            const popupContent = `
    <strong>${image_name}</strong><br/>
    <b>Time:</b> ${timestamp}<br/>
    <b>Labels:</b> ${readableLabels.join(", ")}
  `;

            // 📍 Marker on map
            const marker = L.marker([latitude, longitude], { icon: customIcon })
                .addTo(map)
                .bindPopup(popupContent);

            // 🧾 Table row
            const row = document.createElement("tr");
            row.innerHTML = `
    <td>${timestamp}</td>
    <td>${latitude.toFixed(2)}</td>
    <td>${longitude.toFixed(2)}</td>
    <td>${readableLabels.join(", ")}</td>
  `;

            // 👆 Click row to center map
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
