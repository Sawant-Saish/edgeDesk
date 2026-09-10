/**
 * Fixed target roles for skill-gap dropdown.
 * requiredSkillIds MUST exist in skillTaxonomy.data.js.
 */
const roleRequirements = [
  {
    roleId: 'frontend_react_dev',
    displayName: 'Frontend React Developer',
    requiredSkillIds: [
      'javascript',
      'typescript',
      'html',
      'css',
      'react',
      'redux',
      'responsive_design',
      'git',
      'testing_jest',
      'testing_rtl',
      'vite',
      'tailwind',
      'accessibility',
      'rest_api',
    ],
  },
  {
    roleId: 'backend_node_dev',
    displayName: 'Backend Node.js Developer',
    requiredSkillIds: [
      'javascript',
      'typescript',
      'nodejs',
      'express',
      'mongodb',
      'mongoose',
      'postgresql',
      'rest_api',
      'graphql',
      'authentication',
      'jwt',
      'git',
      'docker',
      'unit_testing',
      'api_design',
      'redis',
    ],
  },
  {
    roleId: 'fullstack_mern_dev',
    displayName: 'Full-Stack MERN Developer',
    requiredSkillIds: [
      'javascript',
      'typescript',
      'html',
      'css',
      'react',
      'nodejs',
      'express',
      'mongodb',
      'mongoose',
      'rest_api',
      'authentication',
      'git',
      'testing_jest',
      'docker',
      'system_design',
      'api_design',
    ],
  },
];

const roleById = Object.fromEntries(roleRequirements.map((r) => [r.roleId, r]));

function isValidRoleId(roleId) {
  return Boolean(roleById[roleId]);
}

function getRoleOptions() {
  return roleRequirements.map(({ roleId, displayName }) => ({
    roleId,
    displayName,
  }));
}

module.exports = {
  roleRequirements,
  roleById,
  isValidRoleId,
  getRoleOptions,
};
