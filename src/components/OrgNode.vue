<script setup>
import { computed } from 'vue'

const props = defineProps({
  person: { type: Object, required: true },
})

const isTop = computed(() => props.person.tier === 'founder' || props.person.tier === 'pmo')
const isManager = computed(() => props.person.tier === 'manager')
</script>

<template>
  <!-- Founder / PMO: gradient border over a solid coffee-900 fill -->
  <div v-if="isTop" class="p-px rounded-2xl bg-gradient-to-r from-tech-blue-500 to-tech-blue-600 w-full max-w-xs">
    <div class="flex items-center gap-3 bg-coffee-900 rounded-2xl px-4 py-3">
      <span class="inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-tech-blue-500/20 text-tech-blue-300">
        <i :class="['fas', person.icon]" aria-hidden="true"></i>
      </span>
      <div class="min-w-0">
        <p class="text-white font-semibold">{{ person.name }}</p>
        <p class="text-coffee-200 text-sm">{{ person.role }}</p>
      </div>
    </div>
  </div>

  <!-- Manager / member -->
  <div
    v-else
    :class="[
      'flex items-center gap-3 backdrop-blur-lg bg-white/5 border rounded-2xl px-4 py-3 w-full lg:w-56',
      isManager ? 'border-tech-blue-400/50' : 'border-white/10',
    ]"
  >
    <span class="inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-tech-blue-500/20 text-tech-blue-300">
      <i :class="['fas', person.icon]" aria-hidden="true"></i>
    </span>
    <div class="min-w-0">
      <p class="text-white font-semibold">{{ person.name }}</p>
      <span v-if="isManager" class="px-3 py-1 rounded-full bg-tech-blue-500/20 text-tech-blue-300 text-sm">Manager</span>
      <p v-else class="text-coffee-200 text-sm">{{ person.role }}</p>
    </div>
  </div>
</template>
