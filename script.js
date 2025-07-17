let map, marker;
const needle = document.querySelector('.needle');
const headingText = document.getElementById('heading');

function permissionFlow() {
  if (DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission()
      .then(res => res === 'granted' && 
            window.addEventListener('deviceorientationabsolute', updateOrientation))
      .catch(err => console.warn('Orientation permission not granted', err));
  } else {
    window.addEventListener('deviceorientationabsolute', updateOrientation);
  }
}

function updateOrientation(e) {
  const alpha = e.alpha;
  if (alpha != null) {
    const deg = Math.round(alpha);
    needle.style.transform = `translateX(-50%) rotate(${-deg}deg)`;
    const dir = getCompassDirection(deg);
    headingText.textContent = `Heading: ${deg}° (${dir})`;
  }
}

function getCompassDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW","N"];
  return dirs[Math.round(deg / 45)];
}

function startMap() {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.watchPosition(pos => {
    const { latitude, longitude } = pos.coords;
    if (!map) {
      map = L.map('map').setView([latitude, longitude], 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
      const flagIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      marker = L.marker([latitude, longitude], { icon: flagIcon })
        .addTo(map)
        .bindPopup('📍 You are here')
        .openPopup();
    } else {
      marker.setLatLng([latitude, longitude]);
      map.panTo([latitude, longitude]);
    }
  }, err => alert('Geolocation error: ' + err.message), {
    enableHighAccuracy: true, maximumAge: 10000, timeout: 5000
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', permissionFlow, { once: true });
  startMap();
});
