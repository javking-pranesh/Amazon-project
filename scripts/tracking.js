import { orders, getOrder } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { cart, addToCart } from '../data/cart.js';
import { updateCartQuantity } from './utils/header.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function getTrackingProgress(deliveryDate) {
    const today = dayjs();
    const deliveryDay = dayjs(deliveryDate);
    const totalDays = deliveryDay.diff(today, 'day');
    
    // Calculate progress percentage based on days remaining
    if (totalDays > 5) return 25; // Preparing
    if (totalDays > 2) return 50; // Shipped
    if (totalDays > 0) return 75; // Out for delivery
    return 100; // Delivered
}

function getCurrentStatus(progress) {
    if (progress <= 25) return 'Preparing';
    if (progress <= 50) return 'Shipped';
    if (progress <= 75) return 'Out for delivery';
    return 'Delivered';
}

export function renderTrackingPage() {
    // Show loading state
    const mainElement = document.querySelector('.main');
    mainElement.innerHTML = `
        <div class="order-tracking">
            <div class="loading-message">
                Loading tracking information...
            </div>
        </div>
    `;
    
    // Get orderId and productId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const productId = urlParams.get('productId');
    
    if (!orderId || !productId) {
        // If no parameters, redirect to orders page
        window.location.href = 'orders.html';
        return;
    }
    
    // Find the order and product
    const order = getOrder(orderId);
    
    if (!order) {
        // Order not found
        mainElement.innerHTML = `
            <div class="order-tracking">
                <a class="back-to-orders-link link-primary" href="orders.html">
                    ← View all orders
                </a>
                <div class="error-message">
                    Order not found. The order may have been removed or doesn't exist.
                </div>
            </div>
        `;
        return;
    }
    
    // Find the specific item in the order
    const orderItem = order.items.find(item => item.productId === productId);
    
    if (!orderItem) {
        // Product not found in order
        mainElement.innerHTML = `
            <div class="order-tracking">
                <a class="back-to-orders-link link-primary" href="orders.html">
                    ← View all orders
                </a>
                <div class="error-message">
                    Product not found in this order.
                </div>
            </div>
        `;
        return;
    }
    
    const product = getProduct(productId);
    const deliveryDate = dayjs(orderItem.estimatedDeliveryDate);
    const formattedDeliveryDate = deliveryDate.format('dddd, MMMM D');
    
    // Calculate tracking progress
    const progress = getTrackingProgress(orderItem.estimatedDeliveryDate);
    const currentStatus = getCurrentStatus(progress);
    
    const trackingHTML = `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
                ← View all orders
            </a>

            <div class="delivery-date">
                Arriving on ${formattedDeliveryDate}
            </div>

            <div class="product-info">
                ${orderItem.nameWhenOrdered || product.name}
            </div>

            <div class="product-info">
                Quantity: ${orderItem.quantity}
            </div>

            <img class="product-image" src="${orderItem.imageWhenOrdered || product.image}">

            <div class="progress-labels-container">
                <div class="progress-label ${currentStatus === 'Preparing' ? 'current-status' : ''}">
                    Preparing
                </div>
                <div class="progress-label ${currentStatus === 'Shipped' ? 'current-status' : ''}">
                    Shipped
                </div>
                <div class="progress-label ${currentStatus === 'Out for delivery' ? 'current-status' : ''}">
                    Out for delivery
                </div>
                <div class="progress-label ${currentStatus === 'Delivered' ? 'current-status' : ''}">
                    Delivered
                </div>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            
            <button class="buy-again-button button-primary js-buy-again" 
                data-product-id="${productId}"
                style="margin-top: 30px;">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
            </button>
        </div>
    `;
    
    mainElement.innerHTML = trackingHTML;
    
    // Add event listener for buy again button
    const buyAgainButton = document.querySelector('.js-buy-again');
    if (buyAgainButton) {
        buyAgainButton.addEventListener('click', () => {
            addToCart(productId);
            updateCartQuantity();
            
            buyAgainButton.innerHTML = '✓ Added';
            buyAgainButton.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                buyAgainButton.innerHTML = `
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                `;
                buyAgainButton.style.backgroundColor = '';
            }, 1500);
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderTrackingPage();
    updateCartQuantity();
});