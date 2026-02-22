import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { updateCartQuantity } from "./utils/header.js";

// Make sure DOM is loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderOrderSummary();
        renderPaymentSummary();
        updateCartQuantity();
    } catch (error) {
        console.error('Error loading checkout:', error);
    }
});