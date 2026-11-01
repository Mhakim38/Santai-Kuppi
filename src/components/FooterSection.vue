<script setup>
const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' }
]

const resources = [
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' }
]

const socialLinks = [
  { icon: 'fab fa-linkedin-in', href: '#', label: 'LinkedIn' },
  { icon: 'fab fa-github', href: '#', label: 'GitHub' },
  { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
  { icon: 'fab fa-instagram', href: '#', label: 'Instagram' }
]
</script>

<template>
  <footer class="relative bg-gradient-to-b from-transparent to-black/50 border-t border-white/10 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Brand Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <i class="fas fa-code text-tech-blue-400 text-2xl"></i>
            <span class="text-white font-bold text-xl">Santai Kuppi</span>
          </div>
          <p class="text-coffee-300 text-sm leading-relaxed">
            Professional web developer creating custom solutions and stunning portfolio websites. Let's bring your vision to life.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3">
            <a 
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href" 
              :aria-label="social.label"
              class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-coffee-300 hover:bg-tech-blue-500 hover:border-tech-blue-500 hover:text-white transition-all duration-300"
            >
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <a 
                :href="link.href"
                class="text-coffee-300 hover:text-tech-blue-400 transition-colors text-sm"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-white font-semibold mb-4">Resources</h3>
          <ul class="space-y-2">
            <li v-for="link in resources" :key="link.name">
              <a 
                :href="link.href"
                class="text-coffee-300 hover:text-tech-blue-400 transition-colors text-sm"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-white font-semibold mb-4">Get In Touch</h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-2 text-coffee-300">
              <i class="fas fa-envelope mt-1 text-tech-blue-400"></i>
              <a href="mailto:hello@santaikuppi.com" class="hover:text-tech-blue-400 transition-colors">
                hello@santaikuppi.com
              </a>
            </li>
            <li class="flex items-start gap-2 text-coffee-300">
              <i class="fas fa-phone mt-1 text-tech-blue-400"></i>
              <a href="tel:+1234567890" class="hover:text-tech-blue-400 transition-colors">
                +1 (234) 567-890
              </a>
            </li>
            <li class="flex items-start gap-2 text-coffee-300">
              <i class="fas fa-map-marker-alt mt-1 text-tech-blue-400"></i>
              <span>Remote / Worldwide</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-coffee-400 text-sm text-center md:text-left">
          © {{ currentYear }} Santai Kuppi. All rights reserved.
        </p>
        <p class="text-coffee-400 text-sm text-center md:text-right">
          Built with <i class="fas fa-heart text-red-500"></i> using Vue.js & Tailwind CSS
        </p>
      </div>
    </div>

    <!-- Back to Top Button -->
    <div class="absolute bottom-8 right-8">
      <a 
        href="#home"
        class="w-12 h-12 rounded-full bg-tech-blue-500 flex items-center justify-center text-white shadow-lg hover:bg-tech-blue-600 hover:scale-110 transition-all duration-300"
        aria-label="Back to top"
      >
        <i class="fas fa-arrow-up"></i>
      </a>
    </div>
  </footer>
</template>

<style scoped>
/* Additional footer styles if needed */
</style>
