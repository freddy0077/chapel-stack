#!/usr/bin/env node

/**
 * Migration script to help identify and update components to use useOrganisationBranch hook
 * This script scans the codebase for patterns that should be migrated
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for
const patterns = [
  'user?.organisationId',
  'user?.branchId',
  'user.userBranches[0].branch.id',
  'user?.userBranches[0]?.branch?.id',
  'user.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id',
];

// Files to exclude from migration
const excludeFiles = [
  'useOrganisationBranch.ts',
  'useAuth.ts',
  'authContext.tsx',
  'MIGRATION_GUIDE.md',
  'migrate-organisation-branch.js',
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function findFilesToMigrate() {
  const srcPath = path.join(__dirname, '..');
  const files = getAllFiles(srcPath);
  
  const filesToMigrate = [];
  
  files.forEach(file => {
    if (excludeFiles.some(exclude => file.includes(exclude))) {
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    const matches = [];
    patterns.forEach(pattern => {
      if (content.includes(pattern)) {
        const lines = content.split('\n');
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
  
  console.log('🔍 Migration Report: useOrganisationBranch Hook');
  console.log('='.repeat(50));
  console.log(`Found ${filesToMigrate.length} files that need migration\n`);
  
  // Group by priority
  const highPriority = filesToMigrate.filter(f => 
    f.file.includes('/dashboard/') && 
    (f.file.includes('/page.tsx') || f.file.includes('Modal.tsx'))
  );
  
  const mediumPriority = filesToMigrate.filter(f => 
    f.file.includes('/components/') || 
    f.file.includes('/hooks/')
  );
  
  const lowPriority = filesToMigrate.filter(f => 
    !highPriority.includes(f) && !mediumPriority.includes(f)
  );
  
  function printFiles(files, title) {
    if (files.length === 0) return;
    
    console.log(`📋 ${title} (${files.length} files)`);
    console.log('-'.repeat(30));
    
    files.forEach(({ file, matches }) => {
      console.log(`📄 ${file}`);
      matches.forEach(match => {
        console.log(`   Line ${match.line}: ${match.pattern}`);
        console.log(`   Code: ${match.content}`);
      });
      console.log('');
    });
  }
  
  printFiles(highPriority, 'HIGH PRIORITY');
  printFiles(mediumPriority, 'MEDIUM PRIORITY');
  printFiles(lowPriority, 'LOW PRIORITY');
  
  // Summary
  console.log('📊 Summary');
  console.log('-'.repeat(20));
  console.log(`High Priority: ${highPriority.length} files`);
  console.log(`Medium Priority: ${mediumPriority.length} files`);
  console.log(`Low Priority: ${lowPriority.length} files`);
  console.log(`Total: ${filesToMigrate.length} files`);
  
  // Migration steps
  console.log('\n🚀 Next Steps');
  console.log('-'.repeat(20));
  console.log('1. Start with HIGH PRIORITY files');
  console.log('2. For each file:');
  console.log('   - Add: import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";');
  console.log('   - Add: const { organisationId, branchId } = useOrganisationBranch();');
  console.log('   - Replace patterns with the new variables');
  console.log('   - Test the component');
  console.log('3. Move to MEDIUM and LOW priority files');
  console.log('4. Run tests to ensure everything works');
  
  return filesToMigrate;
}

// Run the migration report
if (require.main === module) {
  try {
    generateMigrationReport();
  } catch (error) {
    console.error('Error generating migration report:', error);
    process.exit(1);
  }
}

module.exports = { findFilesToMigrate, generateMigrationReport };
