const https = require('https');
const http = require('http');

function checkUrl(url) {
    return new Promise((resolve) => {
        const req = (url.startsWith('https') ? https : http).request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            resolve({ url, status: res.statusCode });
        });
        req.on('error', (e) => resolve({ url, status: e.message }));
        req.end();
    });
}

async function testPage(pageUrl) {
    console.log(`\n--- Testing ${pageUrl} ---`);
    const html = await new Promise((resolve) => {
        https.get(pageUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
    });

    const baseMatch = html.match(/<base\s+href=["'](.*?)["']/i);
    const baseHref = baseMatch ? baseMatch[1] : '';
    console.log(`Base tag found: ${baseHref}`);

    const resolvedBase = baseHref ? new URL(baseHref, pageUrl).href : pageUrl;
    console.log(`Resolved base URL: ${resolvedBase}`);

    const resources = [];
    
    // Find links, scripts, imgs
    const linkRegex = /<link[^>]+href=["'](.*?)["']/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        resources.push(match[1]);
    }
    const scriptRegex = /<script[^>]+src=["'](.*?)["']/gi;
    while ((match = scriptRegex.exec(html)) !== null) {
        resources.push(match[1]);
    }
    const imgRegex = /<img[^>]+src=["'](.*?)["']/gi;
    while ((match = imgRegex.exec(html)) !== null) {
        resources.push(match[1]);
    }

    for (const res of resources) {
        if (res.startsWith('data:')) continue;
        const fullUrl = new URL(res, resolvedBase).href;
        const result = await checkUrl(fullUrl);
        console.log(`[${result.status}] ${fullUrl}`);
    }
}

(async () => {
    await testPage('https://dev.mkavs.com/Pricing');
    await testPage('https://dev.mkavs.com/Branding');
    await testPage('https://dev.mkavs.com/Support');
})();
