<script setup lang="ts"></script>
<script setup lang="ts"></script>
<template>
  <section class="py-16 bg-bg-dark">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Fonctionnalités clés
      </h2>
      <div class="grid gap-8 md:grid-cols-3">
        <div
          class="bg-card-bg rounded-2xl shadow-lg p-8 text-center flex flex-col items-center"
        >
          <img
            src="../../assets/images/imageSimulateur.webp"
            alt="Créer des fausses conversations"
            class="w-72 h-72 object-contain"
            loading="lazy"
          />
          <h3 class="text-xl font-semibold mb-3 text-gray-200">
            Simulateur réaliste
          </h3>
          <p class="text-gray-200 leading-relaxed">
            Personnalisez chaque message, nom d'utilisateur, photo de profil et
            interface pour une conversation bluffante.
          </p>
        </div>
        <div
          class="bg-card-bg rounded-2xl shadow-lg p-8 text-center flex flex-col items-center"
        >
          <img
            src="../../assets/images/social.webp"
            alt="Réseaux sociaux"
            class="w-72 h-72 object-contain"
          />
          <h3 class="text-xl font-semibold mb-3 text-gray-200">
            Multiplateforme
          </h3>
          <p class="text-gray-200 leading-relaxed">
            Simulez des conversations sur Instagram, Messenger, WhatsApp et bien
            plus.
          </p>
        </div>
        <div
          class="bg-card-bg rounded-2xl shadow-lg p-8 text-center flex flex-col items-center"
        >
          <img
            src="../../assets/images/share.webp"
            alt="partager conversation"
            class="mb-6 w-72 h-72 object-contain"
          />
          <h3 class="text-xl font-semibold mb-3 text-gray-200">Partagez</h3>
          <p class="text-gray-200 leading-relaxed">
            Enregistrez et partagez vos créations
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
