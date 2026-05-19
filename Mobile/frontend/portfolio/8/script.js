// 1. Product Data Array (The Catalog) - WITH 12 SLOTS
const products = [
    { id: 1, name: "The Cloud Nine Sectional", price: 799.00, image: "images/cloud nine sofa.jpg" },
    { id: 2, name: "The Artisan Mid-Century", price: 950.00, image: "images/mid century sofa 5.jpg" },
    { id: 3, name: "The Deep Slumber Chaise", price: 1250.00, image: "images/deep sleep slumber chaise.jpg" },
    { id: 4, name: "The Modern Modular Suite", price: 1550.00, image: "images/modern modular suite 2.jpg" },
    { id: 5, name: "The Nordic Comfort Lounger", price: 820.00, image: "images/nordic comfort lounger.jpg" },
    { id: 6, name: "The Chesterfield Classic", price: 1800.00, image: "images/chesterfield classic.jpg" },
    { id: 7, name: "The Majestic Velvet", price: 650.00, image: "images/majestic velvet.jpg" },
    { id: 8, name: "The Reclining Theater Set", price: 2100.00, image: "images/reclining theatre set.jpg" },
    { id: 9, name: "The Velvet Emerald Loveseat", price: 910.00, image: "images/velvet emerald.jpg" },
   
];

// Initialize Wishlist
let cart = JSON.parse(localStorage.getItem('sofaWishlist')) || []; 

// Function to save wishlist
const saveCart = () => {
    localStorage.setItem('sofaWishlist', JSON.stringify(cart));
    updateCartCount();
};

// Function to display products
const renderProducts = () => {
    const productGrid = document.getElementById('products');
    if (!productGrid) return; 

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">Starting at $${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Wishlist</button>
        </div>
    `).join('');

    // Attach event listeners to all 'Add to Wishlist' buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
};

// Function to update the wishlist count in the header
const updateCartCount = () => {
    const cartLink = document.querySelector('nav ul li a[href="cart.html"]');
    if (cartLink) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.textContent = `Wishlist (${totalItems})`;
    }
};

// Function to handle adding an item to the wishlist
const addToCart = (event) => {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        alert(`${product.name} added to your Wishlist!`);
    }
};

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});