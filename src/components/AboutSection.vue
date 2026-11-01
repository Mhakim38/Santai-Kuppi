<script setup>
// Placeholders stay exactly as written until Hakim supplies the text.
const profile = {
  name: 'Muhammad Hakim bin Husin (Hakim)',
  title: 'Technical Lead, Ondewei',
  location: '[LOCATION - Hakim]',
  bio: [
    'Hi, I am Hakim. I build websites and web apps under the Santai Kuppi name. [ONE LINE ON BACKGROUND - Hakim]',
    'I do not work alone. Santai Kuppi runs with an AI staff, a set of specialised assistants for planning, design, development and testing, and I review everything before it ships. [WHY SANTAI KUPPI / PERSONAL LINE - Hakim]'
  ],
  stack: ['[STACK - Hakim confirm]']
}
</script>

<template>
  <section id="about" class="relative py-20 px-4 scroll-mt-24">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-16 reveal-element">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">About</h2>
      </div>

      <div class="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 xl:gap-12">
        <div class="reveal-element backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center">
          <span class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tech-blue-500/20 text-tech-blue-300 text-3xl mb-4">
            <i class="fas fa-user" aria-hidden="true"></i>
          </span>
          <h3 class="text-xl font-semibold text-white">{{ profile.name }}</h3>
          <p class="text-coffee-200 text-sm">{{ profile.title }}</p>
          <p class="text-coffee-200 text-sm mt-3">
            <i class="fas fa-location-dot text-tech-blue-400 mr-2" aria-hidden="true"></i>{{ profile.location }}
          </p>
        </div>

        <div class="reveal-element md:col-span-2 backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <p v-for="(p, i) in profile.bio" :key="i" class="text-coffee-100 leading-relaxed mb-4 last:mb-0">{{ p }}</p>
          <div class="flex flex-wrap gap-2 mt-6">
            <span
              v-for="s in profile.stack"
              :key="s"
              class="px-3 py-1 rounded-full bg-tech-blue-500/20 text-tech-blue-300 text-sm"
            >{{ s }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
