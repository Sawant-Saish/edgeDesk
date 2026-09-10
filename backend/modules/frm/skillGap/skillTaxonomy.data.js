/**
 * Closed skill vocabulary for FRM.
 * skillId values are the only valid identifiers the LLM may return.
 * Do not grow this list at runtime — edit this file intentionally.
 */
const skillTaxonomy = [
  // Languages
  { skillId: 'javascript', displayName: 'JavaScript', category: 'language' },
  { skillId: 'typescript', displayName: 'TypeScript', category: 'language' },
  { skillId: 'python', displayName: 'Python', category: 'language' },
  { skillId: 'html', displayName: 'HTML', category: 'language' },
  { skillId: 'css', displayName: 'CSS', category: 'language' },
  { skillId: 'sql', displayName: 'SQL', category: 'language' },
  { skillId: 'go', displayName: 'Go', category: 'language' },
  { skillId: 'java', displayName: 'Java', category: 'language' },

  // Frontend
  { skillId: 'react', displayName: 'React', category: 'frontend' },
  { skillId: 'nextjs', displayName: 'Next.js', category: 'frontend' },
  { skillId: 'vue', displayName: 'Vue.js', category: 'frontend' },
  { skillId: 'angular', displayName: 'Angular', category: 'frontend' },
  { skillId: 'tailwind', displayName: 'Tailwind CSS', category: 'frontend' },
  { skillId: 'redux', displayName: 'Redux', category: 'frontend' },
  { skillId: 'responsive_design', displayName: 'Responsive Design', category: 'frontend' },
  { skillId: 'accessibility', displayName: 'Web Accessibility (a11y)', category: 'frontend' },

  // Backend
  { skillId: 'nodejs', displayName: 'Node.js', category: 'backend' },
  { skillId: 'express', displayName: 'Express.js', category: 'backend' },
  { skillId: 'nestjs', displayName: 'NestJS', category: 'backend' },
  { skillId: 'rest_api', displayName: 'REST APIs', category: 'backend' },
  { skillId: 'graphql', displayName: 'GraphQL', category: 'backend' },
  { skillId: 'authentication', displayName: 'Authentication & JWT', category: 'backend' },
  { skillId: 'websocket', displayName: 'WebSockets', category: 'backend' },

  // Databases
  { skillId: 'mongodb', displayName: 'MongoDB', category: 'database' },
  { skillId: 'postgresql', displayName: 'PostgreSQL', category: 'database' },
  { skillId: 'redis', displayName: 'Redis', category: 'database' },
  { skillId: 'mongoose', displayName: 'Mongoose', category: 'database' },
  { skillId: 'prisma', displayName: 'Prisma', category: 'database' },

  // Testing
  { skillId: 'testing_jest', displayName: 'Jest', category: 'testing' },
  { skillId: 'testing_cypress', displayName: 'Cypress', category: 'testing' },
  { skillId: 'testing_rtl', displayName: 'React Testing Library', category: 'testing' },
  { skillId: 'unit_testing', displayName: 'Unit Testing', category: 'testing' },

  // DevOps / Tools
  { skillId: 'git', displayName: 'Git', category: 'devops' },
  { skillId: 'docker', displayName: 'Docker', category: 'devops' },
  { skillId: 'ci_cd', displayName: 'CI/CD', category: 'devops' },
  { skillId: 'aws', displayName: 'AWS', category: 'devops' },
  { skillId: 'linux', displayName: 'Linux', category: 'devops' },
  { skillId: 'nginx', displayName: 'Nginx', category: 'devops' },

  // Soft / product
  { skillId: 'agile', displayName: 'Agile / Scrum', category: 'process' },
  { skillId: 'system_design', displayName: 'System Design', category: 'process' },
  { skillId: 'api_design', displayName: 'API Design', category: 'process' },
  { skillId: 'debugging', displayName: 'Debugging', category: 'process' },
  { skillId: 'code_review', displayName: 'Code Review', category: 'process' },

  // Adjacent / data
  { skillId: 'figma', displayName: 'Figma', category: 'design' },
  { skillId: 'ui_ux', displayName: 'UI/UX Basics', category: 'design' },
  { skillId: 'data_structures', displayName: 'Data Structures & Algorithms', category: 'cs' },
  { skillId: 'oop', displayName: 'Object-Oriented Programming', category: 'cs' },
  { skillId: 'firebase', displayName: 'Firebase', category: 'backend' },
  { skillId: 'supabase', displayName: 'Supabase', category: 'backend' },
  { skillId: 'vite', displayName: 'Vite', category: 'frontend' },
  { skillId: 'webpack', displayName: 'Webpack', category: 'frontend' },
  { skillId: 'sass', displayName: 'Sass / SCSS', category: 'frontend' },
  { skillId: 'jwt', displayName: 'JWT', category: 'backend' },
  { skillId: 'oauth', displayName: 'OAuth', category: 'backend' },
  { skillId: 'rabbitmq', displayName: 'RabbitMQ', category: 'backend' },
  { skillId: 'kubernetes', displayName: 'Kubernetes', category: 'devops' },
  { skillId: 'terraform', displayName: 'Terraform', category: 'devops' },
  { skillId: 'storybook', displayName: 'Storybook', category: 'frontend' },
  { skillId: 'eslint', displayName: 'ESLint', category: 'devops' },
];

/** Explicit aliases map free-text / common variants → canonical skillId */
const skillAliases = {
  'react.js': 'react',
  'reactjs': 'react',
  'react js': 'react',
  'next.js': 'nextjs',
  'next js': 'nextjs',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'node.js': 'nodejs',
  'node js': 'nodejs',
  'node': 'nodejs',
  'express.js': 'express',
  'expressjs': 'express',
  'tailwindcss': 'tailwind',
  'tailwind css': 'tailwind',
  'js': 'javascript',
  'ts': 'typescript',
  'mongo': 'mongodb',
  'postgres': 'postgresql',
  'postgre sql': 'postgresql',
  'jest': 'testing_jest',
  'cypress': 'testing_cypress',
  'react testing library': 'testing_rtl',
  'rtl': 'testing_rtl',
  'ci/cd': 'ci_cd',
  'cicd': 'ci_cd',
  'rest': 'rest_api',
  'rest api': 'rest_api',
  'rest apis': 'rest_api',
  'web sockets': 'websocket',
  'websockets': 'websocket',
  'auth': 'authentication',
  'jwt auth': 'authentication',
  'a11y': 'accessibility',
  'scss': 'sass',
  'sass/scss': 'sass',
  'dsa': 'data_structures',
  'algorithms': 'data_structures',
  'oop': 'oop',
  'figma design': 'figma',
  'ux': 'ui_ux',
  'ui': 'ui_ux',
};

const skillById = Object.fromEntries(skillTaxonomy.map((s) => [s.skillId, s]));

function isValidSkillId(skillId) {
  return Boolean(skillById[skillId]);
}

function resolveSkillId(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (skillById[trimmed]) return trimmed;
  const lower = trimmed.toLowerCase();
  if (skillById[lower]) return lower;
  if (skillAliases[lower]) return skillAliases[lower];
  const byDisplay = skillTaxonomy.find(
    (s) => s.displayName.toLowerCase() === lower
  );
  return byDisplay ? byDisplay.skillId : null;
}

function getTaxonomyForPrompt() {
  return skillTaxonomy.map((s) => `${s.skillId} (${s.displayName})`).join(', ');
}

module.exports = {
  skillTaxonomy,
  skillAliases,
  skillById,
  isValidSkillId,
  resolveSkillId,
  getTaxonomyForPrompt,
};
