let cart = [];
let currentCategory = "Starters Fry";
let currentTypeFilter = "all"; // 'all', 'veg', or 'non-veg'
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    renderMenu();
});

// --- Category Rendering ---
function renderCategories() {
    const container = document.getElementById("categoryContainer");
    if (!container) return;
    container.innerHTML = "";

    menuData.forEach(cat => {
        const btn = document.createElement("button");
        btn.innerText = cat.category;
        btn.className = `filter-btn ${cat.category === currentCategory ? 'active' : ''}`;
        btn.onclick = () => {
            currentCategory = cat.category;
            updateCategoryUI();
            renderMenu();
        };
        container.appendChild(btn);
    });
}

function updateCategoryUI() {
    const buttons = document.querySelectorAll("#categoryContainer .filter-btn");
    buttons.forEach(btn => {
        btn.classList.toggle("active", btn.innerText === currentCategory);
    });
}

// --- Menu Rendering with Search & Filter Logic ---
function renderMenu() {
    const container = document.getElementById("menuContainer");
    if (!container) return;
    container.innerHTML = "";

    const categoryObj = menuData.find(cat => cat.category === currentCategory);
    if (!categoryObj) return;

    // Filter items based on Veg/Non-Veg AND Search Query
    const filteredItems = categoryObj.items.filter(item => {
        const matchesType = (currentTypeFilter === "all" || item.type === currentTypeFilter);
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (filteredItems.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:gray;">No items found matching your criteria.</p>`;
        return;
    }

    filteredItems.forEach(item => {
        const cartItem = cart.find(i => i.id === item.id);
        const qty = cartItem ? cartItem.qty : 0;

        const card = document.createElement("div");
        card.className = "menu-item";
        card.innerHTML = `
            <div class="type-indicator ${item.type}"></div>
            <img src="assets/${item.id}.jpg" alt="${item.name}" class="item-img" onerror="this.src='https://placehold.co/400x300/4a0404/cba258?text=${item.name}'">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
                <div class="qty-controls">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span id="qty-${item.id}">${qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- Filtering & Search Functions ---
function filterType(type) {
    currentTypeFilter = type;
    document.querySelectorAll(".filter-controls .filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("onclick").includes(type));
    });
    renderMenu();
}

function searchMenu() {
    searchQuery = document.getElementById("menuSearch").value;
    renderMenu();
}

// --- Cart Logic ---
function changeQty(itemId, delta) {
    let itemDetails = null;
    menuData.forEach(cat => {
        const found = cat.items.find(i => i.id === itemId);
        if (found) itemDetails = found;
    });

    const cartIndex = cart.findIndex(i => i.id === itemId);

    if (cartIndex > -1) {
        cart[cartIndex].qty += delta;
        if (cart[cartIndex].qty <= 0) cart.splice(cartIndex, 1);
    } else if (delta > 0) {
        cart.push({ ...itemDetails, qty: 1 });
    }

    updateCartUI(itemId);
}

function updateCartUI(itemId) {
    const qtySpan = document.getElementById(`qty-${itemId}`);
    if (qtySpan) {
        const item = cart.find(i => i.id === itemId);
        qtySpan.innerText = item ? item.qty : 0;
    }
    
    renderCart();
    document.getElementById("cartCount").innerText = `${cart.length} Items`;
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                <span>${item.name} (x${item.qty})</span>
                <span>₹${item.price * item.qty}</span>
            </div>
        `;
    });
    totalPrice.innerText = `₹${total}`;
}

// --- WhatsApp Logic (Ordering) ---
function sendWhatsAppOrder() {
    if (cart.length === 0) return alert("Please select items first!");

    let message = `👑 *NEW ORDER - THE GOLDEN PALACE*%0A%0A`;
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} [x${item.qty}] - ₹${item.price * item.qty}%0A`;
        total += item.price * item.qty;
    });

    message += `%0A💰 *Bill Total: ₹${total}*%0A%0A`;
    message += `📍 *Delivery Address:*%0A_Please send your live location below for faster delivery._%0A%0A`;
    message += `🕒 Please confirm the estimated delivery time!`;

    window.open(`https://wa.me/91XXXXXXXXXX?text=${message}`, "_blank");
}

// --- WhatsApp Logic (Table Booking) ---
function sendTableBooking() {
    let message = `✨ *RESERVATION REQUEST - THE GOLDEN PALACE* ✨%0A%0A`;
    message += `I would like to book a table for a royal dining experience.%0A%0A`;
    message += `👤 *Name:* [Your Name]%0A`;
    message += `👥 *Guests:* [e.g., 5 People]%0A`;
    message += `📅 *Date:* [Enter Date]%0A`;
    message += `🕒 *Time:* [Enter Time]%0A%0A`;
    message += `👑 _We request a private family cabin if available._`;

    window.open(`https://wa.me/91XXXXXXXXXX?text=${message}`, "_blank");
}

// Helper for smooth scrolling
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
