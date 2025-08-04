
const map = L.map('disaster-map').setView([22.5, 78.9], 5); // India-centered

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


fetch("map_data.json")
.then(response => response.json())
.then(data => {
    data.forEach(item => {
    const { image_name, latitude, longitude, timestamp, predicted_labels } = item;

    const popupContent = `
        <strong>${image_name}</strong><br/>
        <b>Time:</b> ${timestamp}<br/>
        <b>Labels:</b> ${predicted_labels.join(", ")}
    `;

    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(popupContent);
    });
})
.catch(err => {
    console.error("Error loading map_data.json:", err);
});

