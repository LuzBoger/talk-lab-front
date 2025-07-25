<script setup lang="ts"></script>

<template>
  <section class="bg-bg-dark py-16">
    <div class="container mx-auto px-6 max-w-6xl">
      <h2 class="text-3xl font-extrabold text-center mb-12 text-white">
        Exemples de quelques commentaires
      </h2>
      <div
        class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 justify-center"
      >
        <div
          class="bg-card-bg rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-start space-x-6 flex-1 max-w-md"
        >
          <img
            src="https://i.pravatar.cc/48?img=7"
            alt="Avatar @lisa"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex flex-col justify-between h-full">
            <div>
              <p class="font-semibold text-main-color mb-1">@lisa</p>
              <p class="text-white leading-relaxed text-base">
                Je viens de piéger mon pote avec ce fake, il y a cru à 100% 😂
              </p>
            </div>
            <small class="text-gray-400 text-end mt-2">il y a 2 heures</small>
          </div>
        </div>

        <div
          class="bg-card-bg rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-start space-x-6 flex-1 max-w-md"
        >
          <img
            src="https://i.pravatar.cc/48?img=18"
            alt="Avatar @kevin22"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex flex-col justify-between h-full">
            <div>
              <p class="font-semibold text-main-color mb-1">@Bassem69</p>
              <p class="text-gray-200 leading-relaxed text-base">
                Parfait pour mes vidéos TikTok ! On dirait vraiment une vraie
                conversation Insta 🔥
              </p>
            </div>
            <small class="text-gray-400 text-end mt-2">hier</small>
          </div>
        </div>

        <div
          class="bg-card-bg rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-start space-x-6 flex-1 max-w-md"
        >
          <img
            src="https://i.pravatar.cc/48?img=25"
            alt="Avatar @influenceuse.pro"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex flex-col h-full justify-between">
            <div>
              <p class="font-semibold text-main-color mb-1">
                @influenceuse.pro
              </p>
              <p class="text-gray-200 leading-relaxed text-base">
                Idéal pour créer du contenu scénarisé rapidement 👌
              </p>
            </div>

            <small class="text-gray-400 text-end mt-2">il y a 3 jours</small>
          </div>
        </div>

        <div
          class="bg-card-bg rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-start space-x-6 flex-1 max-w-md"
        >
          <img
            src="https://i.pravatar.cc/48?img=30"
            alt="Avatar @utilisateurX"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
          <div class="flex flex-col justify-between h-full">
            <div>
              <p class="font-semibold text-main-color mb-1">@LosProutos</p>
              <p class="text-gray-200 leading-relaxed text-base">
                J’ai arrangé la discussion avec ma maîtresse, et ma femme n’a
                pas eu le moindre doute.
              </p>
            </div>

            <small class="text-gray-400 text-end mt-2">il y a 1 semaine</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
