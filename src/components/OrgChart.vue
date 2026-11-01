<script setup>
import { ref, onMounted } from 'vue'
import OrgNode from './OrgNode.vue'

// Org data is fetched at runtime (never bundled, never in git).
const organisation = ref(null)
const status = ref('loading') // loading | ready | error
const open = ref({})

const load = async () => {
  status.value = 'loading'
  try {
    const res = await fetch('./organisation.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    // Mobile accordion: first team open by default so content is never blank.
    open.value = Object.fromEntries(data.teams.map((t, i) => [t.id, i === 0]))
    organisation.value = data
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

onMounted(load)

const toggle = (id) => {
  open.value[id] = !open.value[id]
}

// Odd team count: centre the last card on the 2-column tablet grid.
const lastSpansTablet = (index) =>
  organisation.value.teams.length % 2 === 1 && index === organisation.value.teams.length - 1
</script>

<template>
  <p v-if="status === 'loading'" role="status" class="text-center text-coffee-100">
    <i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>Loading team...
  </p>
  <div
    v-else-if="status === 'error'"
    role="status"
    class="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl mx-auto text-center"
  >
    <p class="text-white mb-4"><i class="fas fa-circle-exclamation mr-2" aria-hidden="true"></i>The team chart could not be loaded.</p>
    <button
      type="button"
      @click="load"
      class="px-8 py-4 backdrop-blur-lg bg-white/10 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-900"
    >
      Try again
    </button>
  </div>
  <ul v-else aria-label="Santai Kuppi organisation chart" class="org flex flex-col items-center w-full">
    <li class="w-full flex justify-center">
      <OrgNode :person="organisation.founder" />
    </li>
    <li class="w-px h-8 bg-white/20" aria-hidden="true"></li>
    <li class="w-full flex justify-center">
      <OrgNode :person="organisation.pmo" />
    </li>
    <li class="w-px h-8 bg-white/20" aria-hidden="true"></li>

    <li class="w-full">
      <ul class="org-row grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative"
        :style="{ '--n': organisation.teams.length, '--inset': `${50 / organisation.teams.length}%` }">
        <li
          v-for="(team, index) in organisation.teams"
          :key="team.id"
          :class="[
            'org-team relative lg:pt-6',
            lastSpansTablet(index) ? 'md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:col-span-1 lg:max-w-none lg:mx-0' : '',
          ]"
        >
          <div class="org-card backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden lg:overflow-visible lg:bg-transparent lg:border-transparent lg:backdrop-blur-none">
            <h3 class="text-xl font-semibold text-white">
              <!-- Mobile: toggle button (below md) -->
              <button
                type="button"
                :id="`team-btn-${team.id}`"
                :aria-expanded="open[team.id]"
                :aria-controls="`team-${team.id}`"
                @click="toggle(team.id)"
                class="md:hidden w-full px-6 py-5 flex items-center justify-between text-left rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-coffee-900"
              >
                <span class="flex items-center gap-3">
                  <i class="fas fa-sitemap text-tech-blue-400" aria-hidden="true"></i>
                  {{ team.name }} team
                </span>
                <i
                  :class="['fas fa-chevron-down text-tech-blue-400 org-chevron', open[team.id] ? 'rotate-180' : '']"
                  aria-hidden="true"
                ></i>
              </button>
              <!-- Tablet and desktop: plain heading -->
              <span :id="`team-title-${team.id}`" class="hidden md:flex items-center gap-3 md:px-6 md:pt-6 lg:px-0 lg:pt-0 lg:justify-center">
                <i class="fas fa-sitemap text-tech-blue-400 lg:hidden" aria-hidden="true"></i>
                {{ team.name }} team
              </span>
            </h3>

            <div
              :id="`team-${team.id}`"
              role="region"
              :aria-labelledby="`team-btn-${team.id}`"
              :class="[
                open[team.id] ? 'block' : 'hidden md:block',
                'px-6 pb-5 pt-4 border-t border-white/10 space-y-3 md:border-t-0 md:pb-6 lg:px-0 lg:pb-0 lg:pt-4 lg:flex lg:flex-col lg:items-center',
              ]"
            >
              <OrgNode v-if="team.manager" :person="team.manager" />
              <ul class="org-members space-y-3 lg:border-l lg:border-white/20 lg:ml-6 lg:pl-4 lg:mt-4 lg:self-center">
                <li v-for="member in team.members" :key="member.name">
                  <OrgNode :person="member" />
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
/* Desktop connectors: drop line per team, horizontal bar across the row */
@media (min-width: 1024px) {
  .org-row {
    grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  }
  .org-team::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 1.5rem;
    background-color: rgb(255 255 255 / 0.2);
  }
  .org-row::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--inset);
    right: var(--inset);
    border-top: 1px solid rgb(255 255 255 / 0.2);
  }
}

.org-chevron {
  transition: transform 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .org-chevron {
    transition: none;
  }
}
</style>
