<template>
    <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta harum veniam saepe quis quidem? Voluptates enim
        pariatur voluptate quam magnam animi delectus, voluptatem labore, nobis cumque odit hic, reprehenderit
        blanditiis.
    </p>

    <!-- Ouvrir la modal -->
    <button class="btn" @click="openModal">Open Modal</button>

    <dialog ref="myModal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <h3 class="text-lg font-bold">Hello!</h3>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4">
                    <div ref="mapContainer" :style="{ height: '400px', width: '100%' }"></div>
                </div>
                <div class="bg-green-200 p-4">Colonne 2</div>
            </div>

            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const lat = ref(0);
const lng = ref(0);
const map = ref(null);
const mapContainer = ref(null);
const marker = ref(null);
const myModal = ref(null); // Référence à la modal

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

// Fonction pour obtenir la localisation de l'utilisateur
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat.value = position.coords.latitude;
            lng.value = position.coords.longitude;
            map.value.setView([lat.value, lng.value], 13);

            // Si un marqueur existe déjà, le retirer avant d'ajouter un nouveau
            if (marker.value) {
                map.value.removeLayer(marker.value);
            }

            // Ajouter le marqueur et le rendre déplaçable
            import('leaflet').then((L) => {
                marker.value = L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value);

                // Ajouter un écouteur d'événement pour capturer les nouvelles coordonnées après le déplacement
                marker.value.on('dragend', (event) => {
                    const newCoords = event.target.getLatLng();
                    lat.value = newCoords.lat;
                    lng.value = newCoords.lng;
                    console.log(`New coordinates: Lat: ${lat.value}, Lng: ${lng.value}`);
                });
            });
        }, (error) => {
            console.error('Error obtaining location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Fonction pour ouvrir la modal
function openModal() {
    if (myModal.value) {
        myModal.value.showModal(); // Utilisation de ref pour ouvrir la modal
        getLocation(); // Appeler la fonction pour obtenir la localisation lors de l'ouverture de la modal
    }
}

// Appeler getLocation au démarrage (peut être supprimé si on ne veut pas initialiser la carte immédiatement)
onMounted(() => {
    // getLocation(); // Décommenter si vous souhaitez obtenir la localisation au démarrage
});
</script>

<style>
.modal {
    /* Ajoutez des styles supplémentaires pour la modal si nécessaire */
}
</style>
