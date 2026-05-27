(function() {
    // Check if preloader has already run in this session
    if (sessionStorage.getItem('mkavs_preloaded') === 'true') {
        return; // Exit immediately, no preloader
    }

    // Create the Preloader UI
    const preloaderHTML = `
        <div id="global-mkavs-preloader" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #111111;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s ease-out;
        ">
            <div style="margin-bottom: 2rem;">
                <img src="images/LOGOI.png" alt="mKavs Logo" style="height: 80px; filter: brightness(0) invert(1);" onerror="this.style.display='none'" />
            </div>
            
            <div style="
                width: 250px;
                height: 4px;
                background-color: #333;
                border-radius: 4px;
                overflow: hidden;
            ">
                <div id="mkavs-progress-bar" style="
                    width: 0%;
                    height: 100%;
                    background-color: #c7f908;
                    transition: width 0.1s linear;
                "></div>
            </div>
            <p id="mkavs-progress-text" style="
                color: #888;
                font-family: sans-serif;
                font-size: 12px;
                margin-top: 1rem;
                text-transform: uppercase;
                letter-spacing: 2px;
            ">Loading Assets... 0%</p>
        </div>
    `;

    document.write(preloaderHTML);

    // List of assets to preload
    const assetsToPreload = [
        // Fonts
        'https://fonts.googleapis.com/css2?family=Notable&display=swap',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Permanent+Marker&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        
        // Subpages
        'about/about.html',
        'works/index.html',
        'branding/branding.html',
        'pricingpage/pricing.html',
        'consult/consult.html',
        'support/support.html',
        'loginpg/login.html',

        // Images
        'images/MKAVS.png',
        'images/LOGOI.png',
        'images/herofg.png',
        'images/hero.png',
        'images/1.jpeg',
        'images/2.jpeg',
        'images/3.jpeg',
        'images/thumb1.png',
        'images/thumb2.png',
        'images/thumb3.png'
    ];

    let loadedCount = 0;
    let completed = false;
    const totalAssets = assetsToPreload.length;

    function updateProgress() {
        if (completed) return;
        loadedCount++;
        const percent = Math.round((loadedCount / totalAssets) * 100);
        
        const progressBar = document.getElementById('mkavs-progress-bar');
        const progressText = document.getElementById('mkavs-progress-text');
        
        if (progressBar) progressBar.style.width = Math.min(percent, 100) + '%';
        if (progressText) progressText.innerText = 'Loading Assets... ' + Math.min(percent, 100) + '%';

        if (loadedCount >= totalAssets) {
            completePreloader();
        }
    }

    function completePreloader() {
        if (completed) return;
        completed = true;
        
        const progressBar = document.getElementById('mkavs-progress-bar');
        const progressText = document.getElementById('mkavs-progress-text');
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.innerText = 'Loading Assets... 100%';

        setTimeout(() => {
            const preloader = document.getElementById('global-mkavs-preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    sessionStorage.setItem('mkavs_preloaded', 'true');
                }, 800);
            }
        }, 300);
    }

    // Wait until document body exists before starting fetches to prioritize initial HTML parsing
    window.addEventListener('load', () => {
        // 5 seconds max fallback timeout
        setTimeout(completePreloader, 5000);

        assetsToPreload.forEach(url => {
            if (url.match(/\.(jpeg|jpg|png|gif|svg|webp)$/i)) {
                const img = new Image();
                img.onload = updateProgress;
                img.onerror = updateProgress;
                img.src = url;
            } else {
                fetch(url, { mode: 'no-cors', cache: 'force-cache' })
                    .then(updateProgress)
                    .catch(updateProgress);
            }
        });
    });
})();
