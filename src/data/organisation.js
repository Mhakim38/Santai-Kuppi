// Organisation data for the org chart. Roles only, no project details.
// Team names live ONLY in TEAM_NAMES below so they can be renamed in one place.
export const TEAM_NAMES = {
  ondw: 'ONDW',
  idusp: 'IDUSP',
  santai: 'Santai Kuppi',
}

// Role -> FontAwesome 6 icon (fas)
const ICONS = {
  founder: 'fa-crown',
  pmo: 'fa-diagram-project',
  manager: 'fa-sitemap',
  security: 'fa-shield-halved',
  research: 'fa-magnifying-glass',
  business: 'fa-chart-line',
  uiux: 'fa-pen-ruler',
  frontend: 'fa-code',
  backend: 'fa-database',
  tester: 'fa-vial',
  devops: 'fa-server',
  strategy: 'fa-bullseye',
  education: 'fa-user-graduate',
  unknown: 'fa-user',
}

const person = (name, role, key, tier = 'member') => ({ name, role, icon: ICONS[key], tier })

export const organisation = {
  founder: person('Hakim', '[TITLE - Hakim]', 'founder', 'founder'),
  pmo: person('Yappy', 'PMO', 'pmo', 'pmo'),
  teams: [
    {
      id: 'ondw',
      name: TEAM_NAMES.ondw,
      manager: person('Hana', 'Manager', 'manager', 'manager'),
      members: [
        person('Reza', 'Security', 'security'),
        person('Sora', 'Research', 'research'),
        person('Nadia', 'Business logic', 'business'),
        person('Mira', 'UI/UX', 'uiux'),
        person('Zara', 'Frontend', 'frontend'),
        person('Davai', 'Tester', 'tester'),
        person('Kai', 'DevOps', 'devops'),
        person('Rina', '[ROLE TBC]', 'unknown'),
      ],
    },
    {
      id: 'idusp',
      name: TEAM_NAMES.idusp,
      manager: person('Ren', 'Manager', 'manager', 'manager'),
      members: [
        person('Sakura', 'Security', 'security'),
        person('Haruto', 'Backend', 'backend'),
        person('Yuki', 'UI/UX', 'uiux'),
        person('Daichi', 'Frontend', 'frontend'),
        person('Aoi', 'Education and HR', 'education'),
        person('Taro', 'Tester', 'tester'),
        person('Souta', 'DevOps', 'devops'),
      ],
    },
    {
      id: 'santai',
      name: TEAM_NAMES.santai,
      manager: person('Kaito', 'Manager', 'manager', 'manager'),
      members: [
        person('Hinata', 'UI/UX', 'uiux'),
        person('Ryo', 'Frontend', 'frontend'),
        person('Mei', 'Strategy and SEO', 'strategy'),
        person('Nana', 'Tester', 'tester'),
        person('Emi', 'DevOps', 'devops'),
      ],
    },
  ],
}
