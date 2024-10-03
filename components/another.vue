<script setup>
import { ref, onMounted } from 'vue';

const lat = ref(0);
const lng = ref(0);
const map = ref(null);
const mapContainer = ref(null);

onMounted(() => {
  if (process.client) {
    // Charger Leaflet uniquement côté client
    import('leaflet').then((L) => {
      map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map.value);
    });
  }
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude;
      lng.value = position.coords.longitude;
      map.value.setView([lat.value, lng.value], 13);
      L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value).on('dragend', function (event) {
        console.log(event);

      });

    });
  }
}
</script>

<template>
  <div>
    <button @click="getLocation">Get Location</button>

    <p>latitude: {{ lat }}</p>
    <p>longitude: {{ lng }}</p>
  </div>

  <div ref="mapContainer" :style="{ height: '400px', width: '400px' }"></div>
</template>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>
