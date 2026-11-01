<script setup>
import { contactLinks } from '../data/contact'
</script>

<template>
  <section id="contact" class="relative min-h-screen py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16 reveal-element">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Let's Talk
        </h2>
        <p class="text-lg sm:text-xl text-coffee-300 max-w-2xl mx-auto">
          Tell us about your project and we will get back to you. [RESPONSE TIME - Hakim] We are open for client projects. Message us on WhatsApp to get started.
        </p>
      </div>

      <!-- Contact channels -->
      <div class="max-w-2xl mx-auto">
        <div class="reveal-element backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 class="text-2xl font-bold text-white mb-6 text-center">Reach out</h3>
          <div class="flex flex-col gap-4">
            <a
              v-for="(link, index) in contactLinks"
              :key="link.name"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              :class="[
                'px-8 py-4 rounded-full font-semibold text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-900 motion-reduce:transform-none motion-reduce:transition-none',
                index === 0
                  ? 'bg-gradient-to-r from-tech-blue-500 to-tech-blue-600 text-white shadow-lg hover:shadow-tech-blue-500/50 hover:scale-105'
                  : 'backdrop-blur-lg bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:scale-105',
              ]"
            >
              <i :class="[link.icon, 'mr-2']" aria-hidden="true"></i>{{ link.name }}
              <span class="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
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
}
</style>
