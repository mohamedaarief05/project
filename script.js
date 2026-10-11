// ==========================================
// Cartify - Online Shopping Cart (script.js)
// Simple, Beginner-Friendly Vanilla JavaScript
// ==========================================

// 1. Array of 8 Sample Products with IDs, Names, Prices, and Local Image paths
const products = [
  { id: 1, name: "Wireless Headphones", price: 800, image: "images/headphones.jpg" },
  { id: 2, name: "Smart Watch", price: 999, image: "images/smartwatch.jpg" },
  { id: 3, name: "Running Shoes", price: 700, image: "images/shoes.jpg" },
  { id: 4, name: "Backpack", price: 499, image: "images/backpack.jpg" },
  { id: 5, name: "Sunglasses", price: 599, image: "images/sunglasses.jpg" },
  { id: 6, name: "T-Shirt", price: 299, image: "images/itsnotcartoonblack.png.webp" },
  { id: 7, name: "Bluetooth Speaker", price: 1299, image: "images/speaker.jpg" },
  { id: 8, name: "Water Bottle", price: 299, image: "images/bottle.jpg" }
];

// 2. Global Cart Array to hold items added by the user
let cart = [];

// Storage key used for saving cart into browser Local Storage
const STORAGE_KEY = "cartify_cart";

// Helper function to format numbers into Indian Rupees (e.g. ₹1,499.00)
function formatCurrency(amount) {
  return "₹" + Number(amount).toFixed(2);
}

// 3. Display Products on the Webpage
function displayProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; // Clear existing contents

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // Create a product card element
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatCurrency(product.price)}</p>
        <button class="btn btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  }
}

// 4. Add a Product to Cart
function addToCart(productId) {
  // Find product in products list
  let selectedProduct = null;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      selectedProduct = products[i];
      break;
    }
  }

  if (!selectedProduct) return;

  // Check if product is already inside the cart
  let foundInCart = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += 1; // Increase quantity
      foundInCart = true;
      break;
    }
  }

  // If not found in cart, add as new item
  if (!foundInCart) {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: 1
    });
  }

  // Save to Local Storage and update interface immediately
  saveCart();
  displayCart();
  showNotification(selectedProduct.name + " added to cart!");
}

// 5. Increase Quantity (+)
function increaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += 1;
      break;
    }
  }
  saveCart();
  displayCart();
}

// 6. Decrease Quantity (-)
function decreaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity -= 1;

      // Automatically remove if quantity reaches 0
      if (cart[i].quantity <= 0) {
        const removedName = cart[i].name;
        cart.splice(i, 1);
        showNotification(removedName + " removed from cart.");
      }
      break;
    }
  }
  saveCart();
  displayCart();
}

// 7. Remove an Item from Cart
function removeFromCart(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      const removedName = cart[i].name;
      cart.splice(i, 1);
      showNotification(removedName + " removed from cart.");
      break;
    }
  }
  saveCart();
  displayCart();
}

// 8. Clear the Entire Cart
function clearCart() {
  if (cart.length === 0) return;

  const userConfirmed = confirm("Are you sure you want to clear your cart?");
  if (userConfirmed) {
    cart = [];
    saveCart();
    displayCart();
    showNotification("Cart cleared successfully.");
  }
}

// 9. Calculate Totals (Subtotal, Discount, Taxable Amount, GST, and Final Total)
function calculateTotal() {
  let subtotal = 0;
  let totalCount = 0;

  // 1. Calculate Subtotal (Sum of price * quantity)
  for (let i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].quantity;
    totalCount += cart[i].quantity;
  }

  // 2. 10% Discount if subtotal is ₹3,000 or more; otherwise ₹0
  let discount = 0;
  if (subtotal >= 3000) {
    discount = subtotal * 0.10;
  }

  // 3. Taxable Amount = Subtotal - Discount
  const taxableAmount = subtotal - discount;

  // 4. 5% GST on Taxable Amount
  const gst = taxableAmount * 0.05;

  // 5. Final Total = Taxable Amount + GST
  const finalTotal = taxableAmount + gst;

  return {
    subtotal: subtotal,
    discount: discount,
    taxableAmount: taxableAmount,
    gst: gst,
    finalTotal: finalTotal,
    totalCount: totalCount
  };
}

// 10. Display Cart and Update Prices in Real-Time
function displayCart() {
  const cartList = document.getElementById("cart-items-list");
  const cartActions = document.getElementById("cart-actions-bar");
  const totals = calculateTotal();

  // Update item counts in navigation
  document.getElementById("nav-cart-count").textContent = totals.totalCount;

  // If cart is empty, show empty message
  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty. Start shopping now!</p>
      </div>
    `;
    if (cartActions) cartActions.style.display = "none";
  } else {
    // Render each item in the cart
    cartList.innerHTML = "";
    if (cartActions) cartActions.style.display = "block";

    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const itemSubtotal = item.price * item.quantity;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item-row";

      itemRow.innerHTML = `
        <div class="cart-col-product">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <span>${item.name}</span>
        </div>
        <div>${formatCurrency(item.price)}</div>
        <div class="cart-qty-buttons">
          <button class="btn-qty" onclick="decreaseQuantity(${item.id})">-</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="btn-qty" onclick="increaseQuantity(${item.id})">+</button>
        </div>
        <div class="cart-subtotal-val">${formatCurrency(itemSubtotal)}</div>
        <div>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;

      cartList.appendChild(itemRow);
    }
  }

  // Update Summary numbers in real-time
  document.getElementById("summary-subtotal").textContent = formatCurrency(totals.subtotal);
  document.getElementById("summary-discount").textContent = "- " + formatCurrency(totals.discount);
  document.getElementById("summary-taxable").textContent = formatCurrency(totals.taxableAmount);
  document.getElementById("summary-gst").textContent = formatCurrency(totals.gst);
  document.getElementById("summary-total").textContent = formatCurrency(totals.finalTotal);

  // Show discount status message
  const discountMsg = document.getElementById("discount-msg");
  if (discountMsg) {
    if (totals.discount > 0) {
      discountMsg.innerHTML = "🎉 10% Discount applied! (Saved " + formatCurrency(totals.discount) + ")";
      discountMsg.style.color = "#16a34a";
    } else if (totals.subtotal > 0) {
      const needed = 3000 - totals.subtotal;
      discountMsg.innerHTML = "Add " + formatCurrency(needed) + " more to get 10% OFF!";
      discountMsg.style.color = "#2563eb";
    } else {
      discountMsg.innerHTML = "Get 10% OFF on orders of ₹3,000 or more.";
      discountMsg.style.color = "#64748b";
    }
  }
}

// 11. Save Cart to Local Storage
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// 12. Load Cart from Local Storage when page opens
function loadCart() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    cart = JSON.parse(savedData);
  } else {
    cart = [];
  }
}

// 13. Checkout Function
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add products before checking out.");
    return;
  }

  const totals = calculateTotal();
  const loggedInUser = localStorage.getItem("cartify_user");
  const greeting = loggedInUser ? "Hello " + loggedInUser + "!\n\n" : "";

  alert(greeting + "Order Placed Successfully!\n\nTotal Items: " + totals.totalCount + "\nPayable Amount: " + formatCurrency(totals.finalTotal) + "\n\nThank you for shopping with Cartify!");

  // Clear cart after checkout demo
  cart = [];
  saveCart();
  displayCart();
}

// 14. Simple Notification Message
let notificationTimer;
function showNotification(message) {
  const notificationBox = document.getElementById("notification");
  if (!notificationBox) return;

  notificationBox.textContent = message;
  notificationBox.style.display = "block";

  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(function () {
    notificationBox.style.display = "none";
  }, 2500);
}

// 15. Login & Authentication Functions (Simple & Beginner-friendly)
function openLoginModal() {
  const modal = document.getElementById("login-modal");
  clearLoginError();
  if (modal) modal.style.display = "flex";
  const emailInput = document.getElementById("login-email") || document.getElementById("login-username");
  if (emailInput) emailInput.focus();
}

function closeLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) modal.style.display = "none";
  clearLoginError();
}

// Function to validate standard email format (e.g., student@gmail.com)
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function showLoginError(message) {
  const errorMsg = document.getElementById("login-error");
  const emailInput = document.getElementById("login-email") || document.getElementById("login-username");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  } else {
    alert(message);
  }
  if (emailInput) {
    emailInput.classList.add("input-error");
  }
}

function clearLoginError() {
  const errorMsg = document.getElementById("login-error");
  const emailInput = document.getElementById("login-email") || document.getElementById("login-username");
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }
  if (emailInput) {
    emailInput.classList.remove("input-error");
  }
}

function handleLogin(event) {
  event.preventDefault(); // Stop page from reloading
  const emailInput = document.getElementById("login-email") || document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  clearLoginError();

  // Validate that email is not empty
  if (!email) {
    showLoginError("Please enter your email address.");
    if (emailInput) emailInput.focus();
    return;
  }

  // Validate that the input is a valid email / gmail format
  if (!isValidEmail(email)) {
    showLoginError("Please enter a valid email address (e.g. name@gmail.com).");
    if (emailInput) emailInput.focus();
    return;
  }

  // Validate password
  if (!password) {
    showLoginError("Please enter your password.");
    if (passwordInput) passwordInput.focus();
    return;
  }

  // Save logged-in email in Local Storage
  localStorage.setItem("cartify_user", email);
  checkLoginStatus();
  closeLoginModal();
  showNotification("Welcome, " + email + "!");

  // Reset inputs
  if (emailInput) emailInput.value = "";
  if (passwordInput) passwordInput.value = "";
}

function logout() {
  localStorage.removeItem("cartify_user");
  checkLoginStatus();
  showNotification("Logged out successfully.");
}

function checkLoginStatus() {
  const user = localStorage.getItem("cartify_user");
  const authNavItem = document.getElementById("auth-nav-item");

  if (!authNavItem) return;

  if (user) {
    // If logged in, show user email and logout button
    authNavItem.innerHTML = `
      <div class="user-greeting-wrap">
        <span title="${user}">👤 <strong>${user}</strong></span>
        <button class="btn-logout" onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    // If logged out, show Login button
    authNavItem.innerHTML = `
      <button class="btn-login" onclick="openLoginModal()">Login</button>
    `;
  }
}

// Setup event listeners for login modal & input feedback
function setupLoginListeners() {
  const emailInput = document.getElementById("login-email") || document.getElementById("login-username");
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      clearLoginError();
    });
  }

  // Close modal when clicking outside the box
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeLoginModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLoginModal();
    }
  });
}

// 16. Run on page load
window.onload = function () {
  displayProducts();
  loadCart();
  displayCart();
  checkLoginStatus();
  setupLoginListeners();
};

