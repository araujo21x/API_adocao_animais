module.exports = {
  rootDir: './',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000
};
