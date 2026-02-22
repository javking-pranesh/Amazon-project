import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { updateCartQuantity } from "./utils/header.js";
import { cart } from '../data/cart.js';

// Function to update the checkout header item count
function updateCheckoutHeader() {
    // Calculate total items in cart
    let totalItems = 0;
    cart.forEach((item) => {
        totalItems += item.quantity;
    });
    
    // Update the checkout header text
    const checkoutHeader = document.querySelector('.checkout-header-middle-section');
    if (checkoutHeader) {
        checkoutHeader.innerHTML = `
            Checkout (<a class="return-to-home-link"
                href="amazon.html">${totalItems} items</a>)
        `;
    }
}

// Make this function available globally for other modules
window.updateCheckoutHeader = updateCheckoutHeader;

// Make sure DOM is loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderOrderSummary();
        renderPaymentSummary();
        updateCartQuantity();
        updateCheckoutHeader();
    } catch (error) {
        console.error('Error loading checkout:', error);
    }
});