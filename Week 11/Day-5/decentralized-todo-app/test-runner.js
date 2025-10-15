const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Starting comprehensive TodoList contract testing...\n");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function logSection(title) {
  console.log(`${colors.cyan}${colors.bright}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}  ${title}${colors.reset}`);
  console.log(
    `${colors.cyan}${colors.bright}${"=".repeat(60)}${colors.reset}\n`
  );
}

function logStep(step, command) {
  console.log(`${colors.yellow}${colors.bright}📋 ${step}${colors.reset}`);
  if (command) {
    console.log(`${colors.blue}   Command: ${command}${colors.reset}\n`);
  }
}

function runCommand(command, description) {
  try {
    logStep(description, command);
    const output = execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      encoding: "utf8",
    });
    console.log(
      `${colors.green}✅ ${description} completed successfully\n${colors.reset}`
    );
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ ${description} failed:${colors.reset}`);
    console.log(`${colors.red}${error.message}${colors.reset}\n`);
    return false;
  }
}

async function main() {
  const results = {
    compile: false,
    basicTests: false,
    gasTests: false,
    securityTests: false,
    integrationTests: false,
    coverage: false,
  };

  // 1. Clean and compile contracts
  logSection("CONTRACT COMPILATION");
  results.compile = runCommand(
    "npx hardhat clean && npx hardhat compile",
    "Cleaning and compiling contracts"
  );

  if (!results.compile) {
    console.log(
      `${colors.red}${colors.bright}❌ Compilation failed. Cannot proceed with testing.${colors.reset}`
    );
    process.exit(1);
  }

  // 2. Run basic functionality tests
  logSection("BASIC FUNCTIONALITY TESTS");
  results.basicTests = runCommand(
    "npx hardhat test test/TodoList.test.js",
    "Running basic functionality tests"
  );

  // 3. Run gas optimization tests
  logSection("GAS OPTIMIZATION TESTS");
  results.gasTests = runCommand(
    "REPORT_GAS=true npx hardhat test test/TodoList.gas.test.js",
    "Running gas optimization tests"
  );

  // 4. Run security tests
  logSection("SECURITY & EDGE CASE TESTS");
  results.securityTests = runCommand(
    "npx hardhat test test/TodoList.security.test.js",
    "Running security and edge case tests"
  );

  // 5. Run integration tests
  logSection("INTEGRATION TESTS");
  results.integrationTests = runCommand(
    "npx hardhat test test/TodoList.integration.test.js",
    "Running integration tests"
  );

  // 6. Run coverage analysis
  logSection("CODE COVERAGE ANALYSIS");
  results.coverage = runCommand(
    "npx hardhat coverage",
    "Running code coverage analysis"
  );

  // 7. Generate test summary
  logSection("TEST SUMMARY");

  const passedTests = Object.values(results).filter((result) => result).length;
  const totalTests = Object.keys(results).length;

  console.log(`${colors.bright}Test Results Summary:${colors.reset}`);
  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed
      ? `${colors.green}✅ PASSED`
      : `${colors.red}❌ FAILED`;
    const testName =
      test.charAt(0).toUpperCase() + test.slice(1).replace(/([A-Z])/g, " $1");
    console.log(`  ${testName.padEnd(25)} ${status}${colors.reset}`);
  });

  console.log(
    `${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`
  );

  if (passedTests === totalTests) {
    console.log(
      `${colors.green}${colors.bright}🎉 ALL TESTS PASSED! (${passedTests}/${totalTests})${colors.reset}`
    );
    console.log(
      `${colors.green}${colors.bright}   Your TodoList contract is ready for deployment!${colors.reset}`
    );
  } else {
    console.log(
      `${colors.yellow}${colors.bright}⚠️  ${passedTests}/${totalTests} test suites passed${colors.reset}`
    );
    console.log(
      `${colors.yellow}   Please review failed tests before deployment${colors.reset}`
    );
  }

  // 8. Show additional information
  console.log(
    `\n${colors.cyan}${colors.bright}📊 Additional Information:${colors.reset}`
  );

  if (fs.existsSync("./coverage")) {
    console.log(
      `${colors.blue}   📈 Coverage report available in: ./coverage/index.html${colors.reset}`
    );
  }

  if (fs.existsSync("./artifacts")) {
    console.log(
      `${colors.blue}   📦 Compiled artifacts available in: ./artifacts${colors.reset}`
    );
  }

  console.log(
    `${colors.blue}   🔧 Gas reporter data available in console output${colors.reset}`
  );
  console.log(
    `${colors.blue}   📋 Contract size and optimization info included${colors.reset}`
  );

  // 9. Recommendations
  console.log(
    `\n${colors.magenta}${colors.bright}💡 Recommendations:${colors.reset}`
  );

  if (results.coverage) {
    console.log(
      `${colors.magenta}   • Review coverage report for any uncovered code paths${colors.reset}`
    );
  }

  if (results.gasTests) {
    console.log(
      `${colors.magenta}   • Analyze gas usage patterns for optimization opportunities${colors.reset}`
    );
  }

  if (results.securityTests) {
    console.log(
      `${colors.magenta}   • Security tests passed - contract follows best practices${colors.reset}`
    );
  }

  console.log(
    `${colors.magenta}   • Consider additional testing on testnet before mainnet deployment${colors.reset}`
  );
  console.log(
    `${colors.magenta}   • Review gas costs for user operations${colors.reset}`
  );
  console.log(
    `${colors.magenta}   • Consider implementing additional features based on test insights${colors.reset}`
  );

  console.log(
    `\n${colors.cyan}${colors.bright}${"=".repeat(60)}${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright}  Testing Complete!${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright}${"=".repeat(60)}${colors.reset}\n`
  );

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run the test suite
main().catch((error) => {
  console.error(
    `${colors.red}${colors.bright}❌ Test runner failed:${colors.reset}`
  );
  console.error(`${colors.red}${error.message}${colors.reset}`);
  process.exit(1);
});
