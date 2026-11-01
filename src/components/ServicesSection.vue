<script setup>
const services = [
  {
    icon: 'fa-globe',
    title: 'Custom Website Development',
    description: 'We build your site from scratch around your goals, with clean code that is easy to grow.'
  },
  {
    icon: 'fa-user-tie',
    title: 'Portfolio Websites',
    description: 'A portfolio that shows your work clearly, for creatives, freelancers and professionals.'
  },
  {
    icon: 'fa-mobile-alt',
    title: 'Responsive Design',
    description: 'Mobile-first layouts that work on phones, tablets and desktops.'
  },
  {
    icon: 'fa-search',
    title: 'SEO Optimization',
    description: 'Semantic markup, proper titles and meta descriptions, and sensible structure so search engines can understand your site.'
  },
  {
    icon: 'fa-rocket',
    title: 'Performance Optimization',
    description: 'We keep pages light and interactions smooth, so visitors are not left waiting.'
  },
  {
    icon: 'fa-wrench',
    title: 'Maintenance & Support',
    description: 'We stay available after launch for updates, fixes and content changes. [SUPPORT TERMS - Hakim]'
  }
]
</script>

<template>
  <section id="services" class="relative min-h-screen py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16 reveal-element">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          What We Can Do For You
        </h2>
        <p class="text-lg sm:text-xl text-coffee-300 max-w-2xl mx-auto">
          We build websites and web apps for people and small businesses. Here is what we can do for you.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(service, index) in services" 
          :key="index"
          class="group reveal-element backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-tech-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-tech-blue-500/20"
        >
          <!-- Number -->
          <div class="mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-tech-blue-500 to-tech-blue-600 text-white text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
              {{ index + 1 }}
            </div>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-tech-blue-300 transition-colors">
            {{ service.title }}
          </h3>
          <p class="text-coffee-300 leading-relaxed">
            {{ service.description }}
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-16 reveal-element">
        <a 
          href="#contact" 
          class="inline-block px-8 py-4 bg-gradient-to-r from-tech-blue-500 to-tech-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-tech-blue-500/50 hover:scale-105 transition-all duration-300"
        >
          Let's Work Together
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reveal-element {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-element.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .reveal-element {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .group:hover {
    transform: none !important;
  }
}
</style>
