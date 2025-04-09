
const { execSync } = require('child_process');
const fs = require('fs');

// Build the project
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create or update .nojekyll file to bypass Jekyll processing
fs.writeFileSync('./dist/.nojekyll', '');

// Deploy to GitHub Pages
console.log('Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist', { stdio: 'inherit' });

console.log('Deployment complete!');
