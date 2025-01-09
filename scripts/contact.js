onload = async () => {
  const map = L.map('map').setView([30.7743, 31.0026], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/copyright"></a>',
  }).addTo(map);

  L.marker([30.7743, 31.0026])
    .addTo(map)
    .bindPopup('<b>ITI TANTA</b><br>tanta university')
    .openPopup();
};
