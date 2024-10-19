const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
function runCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error running command: ${command}`, error);
    process.exit(1);
  }
}

// Function to get version from package.json
function getPackageVersion(packagePath) {
  const packageJsonPath = path.resolve(process.cwd(), packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`package.json not found for ${packagePath}!`);
    process.exit(1);
  }
  
  const packageJson = require(packageJsonPath);
  return packageJson.version;
}

// Function to check if the version is a semver major bump
function isMajorSemver(version) {
  const [major] = version.split('.');
  return parseInt(major, 10) > 1;  // Assume 1.x.x is current, adjust as needed
}

// Function to check if the version is in April or October for calver
function isAllowedCalver(version) {
  const [year, month] = version.split('.');
  const calverMonth = parseInt(month, 10);
  return calverMonth === 4 || calverMonth === 10;
}

// Function to generate a temporary API report using API Extractor
function generateApiReport(project, outputDir) {
  console.log(`Generating API report for project: ${project}`);
  const tempApiExtractorJson = `
  {
    "extends": "./${project}/api-extractor.json",
    "mainEntryPointFilePath": "./dist/${project}/index.d.ts",
    "dtsRollup": {
      "enabled": true,
      "untrimmedFilePath": "${outputDir}/temp-api-report.json"
    }
  }`;

  // Write temporary api-extractor.json
  const tempApiExtractorPath = path.join(project, 'temp-api-extractor.json');
  fs.writeFileSync(tempApiExtractorPath, tempApiExtractorJson, 'utf-8');

  // Run API Extractor with the temporary config
  runCommand(`npx api-extractor run --config ${tempApiExtractorPath} --local`);

  // Remove temporary api-extractor.json
  fs.unlinkSync(tempApiExtractorPath);
}

// Function to detect breaking changes for affected projects
function detectBreakingChangesForProject(project) {
  const baselineDir = path.join(project, 'temp/api-report-baseline'); // Temp baseline report
  const prDir = path.join(project, 'temp/api-report-pr'); // Temp PR report

  // Step 1: Generate the baseline API report
  console.log(`Generating baseline API report for ${project}`);
  runCommand(`git checkout origin/main`);  // Switch to the main branch
  generateApiReport(project, baselineDir);

  // Step 2: Generate the PR API report
  console.log(`Generating PR API report for ${project}`);
  runCommand(`git checkout -`);  // Switch back to the PR branch
  generateApiReport(project, prDir);

  // Step 3: Compare the two reports
  const baselineReportPath = path.join(baselineDir, 'temp-api-report.json');
  const prReportPath = path.join(prDir, 'temp-api-report.json');

  if (fs.existsSync(baselineReportPath) && fs.existsSync(prReportPath)) {
    const baselineReport = JSON.parse(fs.readFileSync(baselineReportPath, 'utf-8'));
    const prReport = JSON.parse(fs.readFileSync(prReportPath, 'utf-8'));

    if (JSON.stringify(baselineReport) !== JSON.stringify(prReport)) {
      console.log(`API changes detected in ${project}.`);

      // Get the version of the project
      const version = getPackageVersion(project);
      console.log(`Current version of ${project}: ${version}`);

      // Check if the version bump allows breaking changes
      if (isMajorSemver(version) || isAllowedCalver(version)) {
        console.log(`Breaking changes allowed for ${project} due to version bump.`);
        console.log(`Announcement: Breaking changes detected and allowed for ${project} due to major version bump or calver.`);
      } else {
        console.error(`Breaking changes detected for ${project} but version bump not allowed!`);
        process.exit(1);  // Exit with failure if breaking changes are detected without proper version bump
      }
    } else {
      console.log(`No breaking changes detected for ${project}.`);
    }
  } else {
    console.error(`API reports not found for ${project}. Ensure both baseline and PR reports are generated.`);
    process.exit(1);
  }
}

// Main execution: Detect affected projects using NX
console.log("Detecting affected projects using NX...");
const affectedProjects = runCommand('npx nx affected:libs --plain').trim().split('\n');

if (affectedProjects.length === 0) {
  console.log("No affected projects. Skipping API check.");
  process.exit(0);
}

affectedProjects.forEach((project) => {
  detectBreakingChangesForProject(project);
});
