const fs = require('fs');
const path = require('path');

const componentsDir = path.join(
  __dirname,
  '..',
  'docs',
  '.rspress',
  'components',
);

if (fs.existsSync(componentsDir)) {
  fs.rmSync(componentsDir, { recursive: true, force: true });
  console.log('Cleaned docs/.rspress/components directory');
}
