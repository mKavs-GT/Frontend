document.addEventListener('DOMContentLoaded', () => {
    // Color circles handling for the product card
    const colorCircles = document.querySelectorAll('.color-circle');
    const cardImgContainer = document.querySelector('.card-img-container');
    let currentImg = document.getElementById('product-card-img');

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            // Update active state on the circles
            colorCircles.forEach(c => c.classList.remove('active'));
            circle.classList.add('active');

            const newImageSrc = circle.getAttribute('data-color');
            if (currentImg && currentImg.src.indexOf(newImageSrc) === -1 && cardImgContainer) {
                // Create new image for a smooth blend merge
                const newImg = document.createElement('img');
                newImg.src = newImageSrc;
                newImg.className = 'product-card-img';
                newImg.style.opacity = '0';
                newImg.style.position = 'absolute';
                newImg.style.transition = 'opacity 0.6s ease-in-out';
                
                cardImgContainer.appendChild(newImg);
                
                // Trigger reflow
                newImg.offsetHeight;
                
                // Fade in the new image over the old one
                newImg.style.opacity = '1';
                
                const oldImg = currentImg;
                currentImg = newImg;
                
                // Remove old image after transition completes
                setTimeout(() => {
                    if (oldImg && oldImg.parentNode) {
                        oldImg.parentNode.removeChild(oldImg);
                    }
                }, 600);
            }
        });
    });
});
