const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/lenovo-1/Documents/GitHub/mKavs/Frontend/frontend';

const replacements = [
    { regex: /href=["'](?:\.\.\/|\.\/)?index\.html#?([^"']*)["']/g, replace: 'href="/$1"' },
    // E.g. href="../index.html#slide-3" -> href="/#slide-3"
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.vercel') {
            continue; 
        }
        
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { regex, replace } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replace);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed index links in ${fullPath}`);
            }
        }
    }
}

processDirectory(dir);
console.log('Done fixing index links!');
