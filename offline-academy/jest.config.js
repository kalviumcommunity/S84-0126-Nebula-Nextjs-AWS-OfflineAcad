const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverage: true,
  collectCoverageFrom: [
    // Coverage scope for this assignment (keeps thresholds realistic)
    'src/app/api/enroll/route.ts',
    'src/app/api/me/route.ts',
    'src/app/api/progress/route.ts',
    'src/lib/format.ts',
    'src/components/Button.tsx',
    'src/components/ui/Input.tsx',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
