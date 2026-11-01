<script setup>
import { projects } from '../data/projects'

const linkClass =
  'text-tech-blue-300 hover:text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-900 rounded-full'
</script>

<template>
  <section id="work" class="relative py-20 px-4 scroll-mt-24">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal-element">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Our Work</h2>
        <p class="text-lg sm:text-xl text-coffee-300 max-w-2xl mx-auto">
          A few projects we have built. We are open for client projects.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <article
          v-for="project in projects"
          :key="project.title"
          class="reveal-element backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:bg-white/10 hover:border-tech-blue-400/50 transition-all duration-300"
        >
          <div class="aspect-video bg-white/5 flex items-center justify-center">
            <i class="fas fa-image text-coffee-400 text-4xl" aria-hidden="true"></i>
          </div>
          <div class="p-6 flex flex-col flex-1">
            <h3 class="text-xl font-semibold text-white mb-2">{{ project.title }}</h3>
            <p class="text-coffee-200 mb-4">{{ project.description }}</p>
            <div v-if="project.tags.length" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-3 py-1 rounded-full bg-tech-blue-500/20 text-tech-blue-300 text-sm"
              >{{ tag }}</span>
            </div>
            <div v-if="project.links.live || project.links.github" class="mt-auto flex flex-wrap gap-x-6 gap-y-2">
              <a v-if="project.links.live" :href="project.links.live" target="_blank" rel="noopener noreferrer" :class="linkClass">
                Live site <i class="fas fa-arrow-up-right-from-square ml-1" aria-hidden="true"></i>
                <span class="sr-only">(opens in a new tab)</span>
              </a>
              <a v-if="project.links.github" :href="project.links.github" target="_blank" rel="noopener noreferrer" :class="linkClass">
                GitHub <i class="fa-brands fa-github ml-1" aria-hidden="true"></i>
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
