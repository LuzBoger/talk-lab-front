<script setup lang="ts"></script>

<template>
  <section class="bg-bg-dark text-white py-16">
    <div class="container mx-auto px-4 max-w-6xl">
      <h2 class="text-3xl font-bold text-center mb-12">
        Exemple de conversation générée
      </h2>
      <div
        class="flex flex-col md:flex-row md:space-x-12 items-center md:items-start"
      >
        <div class="md:w-1/2 mb-10 md:mb-0 bg-card-bg p-6 rounded-2xl">
          <h3 class="text-xl font-semibold mb-6 text-gray-200">
            Étapes de création
          </h3>
          <ol
            class="list-decimal list-inside space-y-4 text-gray-200 leading-relaxed"
          >
            <li>
              <strong>Configurez les détails techniques :</strong> ajoutez les
              indicateurs type tels que le niveau de la batterie, réseau, heure,
              pour une personnalisation totale.
            </li>
            <li>
              <strong>Personnalisez les profils :</strong> nom, photo, eetc.
            </li>
            <li>
              <strong>Écrivez les messages :</strong> rédigez chaque échange
              avec contrôle total.
            </li>
            <li>
              <strong>Visualisez en temps réel :</strong> aperçu instantané de
              la conversation.
            </li>
            <li>
              <strong>Exportez et partagez :</strong> sauvegardez votre création
              au format image .
            </li>
          </ol>
        </div>

        <div class="md:w-1/2 flex justify-center">
          <img
            src="../../assets/images/image.webp"
            alt="Exemple de fausse conversation créée avec TalkLab"
            class="rounded-xl shadow-lg max-w-full md:max-w-lg w-64"
            loading="lazy"
          />
        </div>
      </div>
      <p class="text-center text-sm text-gray-200 mt-8">
        Voici un aperçu réaliste d’une conversation générée avec TalkLab.
      </p>
    </div>
  </section>
</template>
