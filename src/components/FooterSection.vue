<script setup>
import { contactLinks } from '../data/contact'

const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' }
]

const resources = [
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' }
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
            <li v-for="link in contactLinks" :key="link.name">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-coffee-300 hover:text-tech-blue-400 transition-colors"
              >
                <i :class="[link.icon, 'mr-2']" aria-hidden="true"></i>{{ link.name }}
              </a>
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
