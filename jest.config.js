module.exports = {
    preset: "ts-jest",
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
};
