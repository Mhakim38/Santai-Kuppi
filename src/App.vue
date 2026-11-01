<script setup>
import { useScrollReveal } from './composables/useScrollReveal'
import AnimatedBackground from './components/AnimatedBackground.vue'
import Navigation from './components/Navigation.vue'
import HeroPage from './components/HeroPage.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
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
      <ProjectsSection />
      <FaqSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>

<style scoped>
/* App-level styles if needed */
</style>
