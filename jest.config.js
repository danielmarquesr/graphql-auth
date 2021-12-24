module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', './dist'],
  coverageReporters: ['lcov', 'html'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.(ts)?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1',
  },
  testMatch: ['**/?(*.)(test).ts'],
};
