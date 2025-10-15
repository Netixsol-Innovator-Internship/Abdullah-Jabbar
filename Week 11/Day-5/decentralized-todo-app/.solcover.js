module.exports = {
  skipFiles: ["test/", "migrations/", "node_modules/"],
  configureYulOptimizer: true,
  solcOptimizerDetails: {
    yul: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps: "dhfoDgvulfnTUtnIf",
    },
  },
  measurementOutputFormat: "text",
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 60000,
    grep: "@skip-coverage",
    invert: true,
  },
};
