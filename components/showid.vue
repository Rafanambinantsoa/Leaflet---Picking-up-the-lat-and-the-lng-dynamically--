<template>
    <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta harum veniam saepe quis quidem? Voluptates enim
        pariatur voluptate quam magnam animi delectus, voluptatem labore, nobis cumque odit hic, reprehenderit
        blanditiis.
    </p>


    <!-- First Modal  -->
    <!-- Open the modal using ID.showModal() method -->
    <button class="btn" onclick="my_modal_1.showModal()">open modal</button>
    <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Hello!</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <button @click="newModal(1)" class="btn">Close</button>

            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button @click="second.showModal()" class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>

    <!-- Second modal  -->
    <dialog id="second" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Second!</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <div id="map" style="height: 400px;"></div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
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
const mapContainer = ref(null);
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

// Fonction pour ouvrir le modal et charger la carte avec le marqueur
let map; // Déclarer la carte globalement
let marker; // Déclarer le marqueur globalement

// Fonction pour ouvrir le modal et charger la carte avec le marqueur
async function newModal(id) {
    try {
        // Ouvrir le modal
        second.showModal();

        // Appel à l'API pour obtenir les coordonnées en utilisant l'ID
        const response = await fetch(`http://localhost:8000/api/coord/${id}`);
        const data = await response.json();

        if (data && data.latitude && data.longitude) {
            // Si la carte n'a pas encore été créée, la créer
            let floatLat = parseFloat(data.latitude);
            let floatLng = parseFloat(data.longitude);
            if (!map) {
                map = L.map('map').setView([floatLat, floatLng], 13);

                // Ajouter les tuiles OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            } else {
                // Si la carte existe déjà, recentrer la vue sur les nouvelles coordonnées
                map.setView([floatLat, floatLng], 13);
            }

            // Si le marqueur existe déjà, le déplacer, sinon le créer
            if (marker) {
                marker.setLatLng([floatLat, floatLng]);
            } else {
                marker = L.marker([floatLat, floatLng]).addTo(map)
                    .bindPopup('Position actuelle')
                    .openPopup();
            }

        } else {
            console.error("Erreur : Coordonnées non valides");
        }

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API : ", error);
    }
}




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
