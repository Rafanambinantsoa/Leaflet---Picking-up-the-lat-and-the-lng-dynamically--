// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  css: ["leaflet/dist/leaflet.css"], // Importation de la feuille de style de Leaflet
  postcss: {
    plugins: {
      autoprefixer: {}, // Plugin pour ajouter automatiquement les préfixes des navigateurs
      // Ajoute d'autres plugins PostCSS ici si nécessaire
    },
  },
});
