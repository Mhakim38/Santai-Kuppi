<script setup>
// Professional web developer portfolio hero section
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center px-4 pt-20">
    <div class="max-w-5xl mx-auto text-center z-10">
      <!-- Main Headline -->
      <div class="mb-6 animate-fade-in-up">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tech-blue-400 via-coffee-200 to-tech-blue-300 leading-tight mb-4">
          Santai Kuppi
        </h1>
        <div class="text-xl sm:text-2xl md:text-3xl text-coffee-200 font-light tracking-wide">
          Web Developer & Portfolio Solutions
        </div>
      </div>

      <!-- Value Proposition -->
      <p class="text-lg sm:text-xl md:text-2xl text-coffee-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up-delay-1">
        Transforming your ideas into stunning, functional websites. 
        I specialize in creating custom solutions and portfolio websites that make you stand out.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-2">
        <a 
          href="#services"
          class="group px-8 py-4 bg-gradient-to-r from-tech-blue-500 to-tech-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-tech-blue-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          View My Work
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </a>
        <a 
          href="#contact" 
          class="px-8 py-4 backdrop-blur-lg bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300"
        >
          Get In Touch
        </a>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#services" class="flex flex-col items-center text-coffee-300 hover:text-coffee-200 transition-colors">
          <span class="text-sm mb-2">Scroll to explore</span>
          <i class="fas fa-chevron-down text-xl"></i>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in-up-delay-1 {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.animate-fade-in-up-delay-2 {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.6s forwards;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-fade-in-up-delay-1,
  .animate-fade-in-up-delay-2,
  .animate-bounce {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
