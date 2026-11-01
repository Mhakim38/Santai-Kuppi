<script setup>
import { useScrollReveal } from './composables/useScrollReveal'
import AnimatedBackground from './components/AnimatedBackground.vue'
import Navigation from './components/Navigation.vue'
import HeroPage from './components/HeroPage.vue'
import ServicesSection from './components/ServicesSection.vue'
import OrgChart from './components/OrgChart.vue'
import FaqSection from './components/FaqSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'

// Initialize scroll reveal animations
useScrollReveal()
</script>

<template>
  <div class="relative min-h-screen">
    <AnimatedBackground />
    <Navigation />
    <main>
      <HeroPage />
      <ServicesSection />
      <!-- Temporary mount: moves to /company once the router decision is made -->
      <section id="company" class="relative py-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16 reveal-element">
            <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Our team</h2>
            <p class="text-lg sm:text-xl text-coffee-300 max-w-2xl mx-auto">[COMPANY INTRO - pending]</p>
          </div>
          <OrgChart />
        </div>
      </section>
      <FaqSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>

<style scoped>
/* App-level styles if needed */
</style>
