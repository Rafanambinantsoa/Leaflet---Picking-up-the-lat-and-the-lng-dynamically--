<script setup>
import L from 'leaflet';
const lat = ref(0);
const lng = ref(0);
const map = ref();
const mapConctainer = ref()

onMounted(() => {
  map.value = L.map(mapConctainer.value).setView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map.value);
})


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude
      lng.value = position.coords.longitude
    })
  }
}

</script>

<template>
  <div>
    <button @click="getLocation()"> Get Location </button>

    <p> latitude : {{ lat }} </p>
    <p> longitude : {{ lng }} </p>
  </div>

  <div ref="mapConctainer" height="400px" width="400px"> </div>
</template>

<style scoped></style>
