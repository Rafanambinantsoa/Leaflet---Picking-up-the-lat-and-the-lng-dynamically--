<template>
  <div>
    <h2>Enter Coordinates</h2>
    <form @submit.prevent="addMarker">
      <div>
        <label for="latitude">Latitude:</label>
        <input type="number" id="latitude" v-model.number="lat" step="any" required />
      </div>
      <div>
        <label for="longitude">Longitude:</label>
        <input type="number" id="longitude" v-model.number="lng" step="any" required />
      </div>
      <button type="submit">Place Marker</button>
    </form>

    <div ref="mapContainer" :style="{ height: '400px', width: '100%' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const lat = ref(0); // Valeur initiale de latitude
const lng = ref(0); // Valeur initiale de longitude
const map = ref(null);
const marker = ref(null);
const mapContainer = ref(null);

onMounted(() => {
  if (process.client) {
    // Charger Leaflet uniquement côté client
    import('leaflet').then((L) => {
      // Initialiser la carte
      map.value = L.map(mapContainer.value).setView([lat.value, lng.value], 13);

      // Ajouter les tuiles OpenStreetMap
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map.value);
    });
  }
});

function addMarker() {
  // Vérifier si le marqueur existe déjà, sinon le créer
  if (marker.value) {
    marker.value.setLatLng([lat.value, lng.value]); // Déplacer le marqueur
  } else {
    marker.value = L.marker([lat.value, lng.value]).addTo(map.value); // Ajouter un nouveau marqueur
  }

  // Centrer la carte sur les nouvelles coordonnées
  map.value.setView([lat.value, lng.value], 13);
}
</script>

<style scoped>
.leaflet-container {
  height: 100%;
  width: 100%;
}
</style>
