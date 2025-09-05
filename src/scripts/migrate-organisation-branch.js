#!/usr/bin/env node

/**
 * Migration script to help identify and update components to use useOrganisationBranch hook
 * This script scans the codebase for patterns that should be migrated
 */

const fs = require("fs");
const path = require("path");

// Patterns to search for
const patterns = [
  "user?.organisationId",
  "user?.branchId",
  "user.userBranches[0].branch.id",
  "user?.userBranches[0]?.branch?.id",
  "user.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id",
];

// Files to exclude from migration
const excludeFiles = [
  "useOrganisationBranch.ts",
  "useAuth.ts",
  "authContext.tsx",
  "MIGRATION_GUIDE.md",
  "migrate-organisation-branch.js",
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!["node_modules", ".git", ".next", "dist", "build"].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function findFilesToMigrate() {
  const srcPath = path.join(__dirname, "..");
  const files = getAllFiles(srcPath);

  const filesToMigrate = [];

  files.forEach((file) => {
    if (excludeFiles.some((exclude) => file.includes(exclude))) {
      return;
    }

    const content = fs.readFileSync(file, "utf8");

    const matches = [];
    patterns.forEach((pattern) => {
      if (content.includes(pattern)) {
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (line.includes(pattern)) {
            matches.push({
              pattern,
              line: index + 1,
              content: line.trim(),
            });
          }
        });
      }
    });

    if (matches.length > 0) {
      filesToMigrate.push({
        file: path.relative(srcPath, file),
        matches,
      });
    }
  });

  return filesToMigrate;
}

function generateMigrationReport() {
  const filesToMigrate = findFilesToMigrate();

  // Group by priority
  const highPriority = filesToMigrate.filter(
    (f) =>
      f.file.includes("/dashboard/") &&
      (f.file.includes("/page.tsx") || f.file.includes("Modal.tsx")),
  );

  const mediumPriority = filesToMigrate.filter(
    (f) => f.file.includes("/components/") || f.file.includes("/hooks/"),
  );

  const lowPriority = filesToMigrate.filter(
    (f) => !highPriority.includes(f) && !mediumPriority.includes(f),
  );

  function printFiles(files, title) {
    if (files.length === 0) return;

    files.forEach(({ file, matches }) => {
      matches.forEach((match) => {});
    });
  }

  printFiles(highPriority, "HIGH PRIORITY");
  printFiles(mediumPriority, "MEDIUM PRIORITY");
  printFiles(lowPriority, "LOW PRIORITY");

  return filesToMigrate;
}

// Run the migration report
if (require.main === module) {
  try {
    generateMigrationReport();
  } catch (error) {
    process.exit(1);
  }
}

module.exports = { findFilesToMigrate, generateMigrationReport };
