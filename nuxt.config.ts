// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["leaflet/dist/leaflet.css"], // Importation de la feuille de style de Leaflet
  devtools: { enabled: true },

  postcss: {
    plugins: {
      autoprefixer: {}, // Plugin pour ajouter automatiquement les préfixes des navigateurs
      // Ajoute d'autres plugins PostCSS ici si nécessaire
    },
  },
});
