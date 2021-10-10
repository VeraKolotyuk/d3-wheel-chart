module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    "snapshotSerializers": ["enzyme-to-json/serializer"],
    "setupFilesAfterEnv": ["./src/setupEnzyme.ts"],
    transformIgnorePatterns: [
        '/node_modules/(?!d3)'
    ]
};