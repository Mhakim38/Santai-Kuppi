<script setup>
import AnimatedBackground from '../components/AnimatedBackground.vue'
import OrgChart from '../components/OrgChart.vue'
</script>

<template>
  <div class="relative min-h-screen">
    <AnimatedBackground />
    <main class="relative pt-28 pb-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-3xl mx-auto text-center mb-16">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Our team</h1>
          <p class="text-lg sm:text-xl text-coffee-300">[COMPANY INTRO - pending]</p>
          <a
            href="/"
            class="inline-block mt-6 px-8 py-4 backdrop-blur-lg bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-900"
          >
            Back to site
          </a>
        </div>
        <OrgChart />
      </div>
    </main>
  </div>
</template>
