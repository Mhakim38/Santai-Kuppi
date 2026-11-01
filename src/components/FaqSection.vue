<script setup>
import { ref } from 'vue'

const faqs = [
  {
    question: 'What services do you offer?',
    answer: 'We offer custom website development, portfolio websites, responsive design, SEO, performance optimization, and ongoing maintenance and support. Every project is shaped around your needs.',
    open: false
  },
  {
    question: 'How long does a project take?',
    answer: 'It depends on the size of the project. We give you an estimate after we understand what you need. [TYPICAL TIMELINES - Hakim]',
    open: false
  },
  {
    question: 'What is your process?',
    answer: 'We work in four steps: plan, design, build, then test and ship. You are kept in the loop at each step.',
    open: false
  },
  {
    question: 'Do you support the site after launch?',
    answer: 'Yes. We can help with updates, bug fixes and content changes after launch. [SUPPORT PACKAGES / PRICING - Hakim]',
    open: false
  },
  {
    question: 'Can you help with SEO?',
    answer: 'Yes. We build with semantic HTML, proper meta tags and responsive layouts from the start. [EXTRA SEO CONSULTING OFFER - Hakim confirm]',
    open: false
  }
]

const toggleFaq = (index) => {
  faqs[index].open = !faqs[index].open
}
</script>

<template>
  <section id="faq" class="relative min-h-screen py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16 reveal-element">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-lg sm:text-xl text-coffee-300">
          Questions we hear often. If yours is not here, just ask.
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="reveal-element backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-tech-blue-400/50 transition-all duration-300"
        >
          <!-- Question Button -->
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200"
          >
            <span class="text-lg font-semibold text-white pr-4">
              {{ faq.question }}
            </span>
            <i 
              :class="[
                'fas fa-chevron-down text-tech-blue-400 transition-transform duration-300',
                faq.open ? 'rotate-180' : ''
              ]"
            ></i>
          </button>

          <!-- Answer (Expandable) -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="faq.open" class="overflow-hidden">
              <div class="px-6 pb-5 text-coffee-300 leading-relaxed border-t border-white/10 pt-4">
                {{ faq.answer }}
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Still Have Questions -->
      <div class="text-center mt-16 reveal-element">
        <p class="text-coffee-300 mb-6 text-lg">
          Still have questions?
        </p>
        <a 
          href="#contact" 
          class="inline-block px-8 py-4 bg-gradient-to-r from-tech-blue-500 to-tech-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-tech-blue-500/50 hover:scale-105 transition-all duration-300"
        >
          Get In Touch
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
  
  .rotate-180 {
    transform: none !important;
  }
}
</style>
