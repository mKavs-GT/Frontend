const fs = require('fs');
const path = require('path');

const replacements = {
  '`/branding`': '`/Branding`',
  '`/pricing`': '`/Pricing`',
  '`/consult`': '`/Consult`',
  '`/support`': '`/Support`',
  '`/about`': '`/About`',
  '`/works`': '`/Works`',
  '`/login`': '`/Login`',
  '`/home`': '`/Home`',
  '"/branding"': '"/Branding"',
  '"/pricing"': '"/Pricing"',
  '"/consult"': '"/Consult"',
  '"/support"': '"/Support"',
  '"/about"': '"/About"',
  '"/works"': '"/Works"',
  '"/login"': '"/Login"',
  '"/home"': '"/Home"'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [oldPath, newPath] of Object.entries(replacements)) {
        if (content.includes(oldPath)) {
          content = content.split(oldPath).join(newPath);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('frontend');
