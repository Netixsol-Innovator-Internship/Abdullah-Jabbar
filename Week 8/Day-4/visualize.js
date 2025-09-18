import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Import from the modularized index.js
import { exportDot } from './index.js';

// Parse command line arguments
const args = process.argv.slice(2);
const generatePng = args.includes('--png') || args.includes('--all');
const generatePdf = args.includes('--pdf') || args.includes('--all');
const generateSvg = args.includes('--svg') || args.includes('--all') || args.length === 0; // default

console.log('🚀 Generating LangGraph visualization...\n');

try {
  // Step 1: Generate DOT file
  console.log('📝 1. Generating DOT file...');
  const p = exportDot("langgraph");
  
  if (!fs.existsSync('langgraph.dot')) {
    throw new Error('Failed to generate langgraph.dot file');
  }
  
  console.log('✅ DOT file created: langgraph.dot\n');

  // Step 2: Check if Graphviz is available
  console.log('🔧 2. Checking Graphviz installation...');
  let dotCommand = 'dot';
  
  try {
    execSync('dot -V', { stdio: 'pipe' });
    console.log('✅ Graphviz found in PATH\n');
  } catch (err) {
    // Try common installation paths on Windows
    const commonPaths = [
      'C:\\Program Files\\Graphviz\\bin\\dot.exe',
      'C:\\Program Files (x86)\\Graphviz\\bin\\dot.exe',
      'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Graphviz.Graphviz_Microsoft.Winget.Source_8wekyb3d8bbwe\\bin\\dot.exe'
    ];
    
    let foundPath = null;
    for (const testPath of commonPaths) {
      try {
        if (fs.existsSync(testPath)) {
          execSync(`"${testPath}" -V`, { stdio: 'pipe' });
          foundPath = testPath;
          dotCommand = `"${testPath}"`;
          break;
        }
      } catch (e) {
        // Continue trying other paths
      }
    }
    
    if (foundPath) {
      console.log(`✅ Graphviz found at: ${foundPath}\n`);
    } else {
      // Final attempt: check if it's somewhere in common locations
      try {
        execSync('where dot', { stdio: 'pipe' });
        console.log('✅ Graphviz found via where command\n');
        dotCommand = 'dot';
      } catch (e) {
        console.log('❌ Graphviz not found in PATH or common locations');
        console.log('\n🔧 Please add Graphviz to your PATH or restart your terminal');
        console.log('💡 Or restart your computer after the winget install');
        throw new Error('Graphviz not accessible');
      }
    }
  }

  // Step 3: Generate image files
  const outputs = [];
  
  if (generateSvg) {
    console.log('🎨 3a. Generating SVG...');
    execSync(`${dotCommand} -Tsvg langgraph.dot -o langgraph.svg`);
    outputs.push('langgraph.svg');
    console.log('✅ Generated: langgraph.svg');
  }
  
  if (generatePng) {
    console.log('🎨 3b. Generating PNG...');
    execSync(`${dotCommand} -Tpng langgraph.dot -o langgraph.png`);
    outputs.push('langgraph.png');
    console.log('✅ Generated: langgraph.png');
  }
  
  if (generatePdf) {
    console.log('🎨 3c. Generating PDF...');
    execSync(`${dotCommand} -Tpdf langgraph.dot -o langgraph.pdf`);
    outputs.push('langgraph.pdf');
    console.log('✅ Generated: langgraph.pdf');
  }

  // Step 4: Open the file(s)
  console.log('\n👀 4. Opening visualization...');
  
  const primaryOutput = outputs[0];
  try {
    // Try to open the file with default application
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    
    if (isWindows) {
      execSync(`start "" "${primaryOutput}"`, { stdio: 'pipe' });
    } else if (isMac) {
      execSync(`open "${primaryOutput}"`, { stdio: 'pipe' });
    } else {
      // Linux
      execSync(`xdg-open "${primaryOutput}"`, { stdio: 'pipe' });
    }
    
    console.log(`✅ Opened: ${primaryOutput}`);
  } catch (openErr) {
    console.log(`⚠️  Could not auto-open file. Please manually open: ${primaryOutput}`);
  }

  // Step 5: Summary
  console.log('\n🎉 Success! Generated files:');
  console.log('📄 langgraph.dot (source)');
  outputs.forEach(file => console.log(`🖼️  ${file}`));
  
  console.log('\n💡 Tips:');
  console.log('  • Run "node visualize.js --all" to generate SVG, PNG, and PDF');
  console.log('  • Run "node visualize.js --png" for PNG only');
  console.log('  • Files are in the current directory');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  
  if (error.message.includes('Graphviz')) {
    console.log('\n🔧 To install Graphviz:');
    console.log('  Windows: winget install graphviz');
    console.log('  macOS:   brew install graphviz');
    console.log('  Linux:   sudo apt install graphviz');
    console.log('\n🌐 Alternative: Use online viewer at https://dreampuf.github.io/GraphvizOnline/');
  }
  
  process.exit(1);
}