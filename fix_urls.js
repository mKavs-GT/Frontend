const fs = require('fs');
const path = require('path');

const replacements = {
  '../index.html': '/Home',
  '../works/index.html': '/Works',
  '../branding/branding.html': '/Branding',
  '../pricingpage/pricing.html': '/Pricing',
  '../consult/consult.html': '/Consult',
  '../support/support.html': '/Support',
  '../loginpg/login.html': '/Login',
  '../about/about.html': '/About',
  './works/index.html': '/Works',
  './about/about.html': '/About',
  './branding/branding.html': '/Branding',
  './pricingpage/pricing.html': '/Pricing',
  './consult/consult.html': '/Consult',
  './support/support.html': '/Support',
  './loginpg/login.html': '/Login',
  '\"works/index.html\"': '\"/Works\"',
  '\"about/about.html\"': '\"/About\"',
  '\"branding/branding.html\"': '\"/Branding\"',
  '\"pricingpage/pricing.html\"': '\"/Pricing\"',
  '\"consult/consult.html\"': '\"/Consult\"',
  '\"support/support.html\"': '\"/Support\"',
  '\"loginpg/login.html\"': '\"/Login\"',
  '\"index.html\"': '\"/Home\"'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
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
