const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend';
const files = [
    'branding/branding.html',
    'pricingpage/pricing.html',
    'support/support.html',
    'consult/consult.html',
    'loginpg/login.html'
];

files.forEach(f => {
    const fullPath = path.join(dir, f);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');
    const regex = /href=(["'])(?!http|\/|#|mailto|tel|javascript)[^"']+\1/g;
    const matches = content.match(regex);
    console.log(f + ' bare links:');
    if (matches) {
        matches.forEach(m => console.log('  ' + m));
    } else {
        console.log('  none');
    }
});
