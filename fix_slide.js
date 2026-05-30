const fs = require('fs');
const path = require('path');

function r(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory() && f !== 'node_modules' && f !== '.git') {
            r(p);
        } else if (f.endsWith('.html')) {
            let c = fs.readFileSync(p, 'utf8');
            if (c.includes('href="/slide-3"')) {
                fs.writeFileSync(p, c.replace(/href="\/slide-3"/g, 'href="/#slide-3"'));
                console.log('Fixed', p);
            }
        }
    });
}
r('c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend');
