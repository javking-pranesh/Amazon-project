import {orders, getOrder, formatOrderDate} from '../data/orders.js';
import {products, getProduct} from '../data/products.js';
import {cart, addToCart} from '../data/cart.js';
import {formatCurrency} from './utils/money.js';
import {updateCartQuantity} from './utils/header.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function renderOrders() {
    let ordersHTML = '';
    
    orders.forEach((order) => {
        const orderDate = dayjs(order.date);
        const formattedDate = orderDate.format('MMMM D');
        
        let itemsHTML = '';
        
        order.items.forEach((item) => {
            const product = getProduct(item.productId);
            const deliveryDate = dayjs(item.estimatedDeliveryDate);
            const formattedDeliveryDate = deliveryDate.format('MMMM D');
            
            itemsHTML += `
                <div class="product-image-container">
                    <img src="${item.imageWhenOrdered || product.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${item.nameWhenOrdered || product.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${formattedDeliveryDate}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${item.quantity}
                    </div>
                    <button class="buy-again-button button-primary js-buy-again" 
                        data-product-id="${item.productId}">
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                </div>

                <div class="product-actions">
                    <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
                        <button class="track-package-button button-secondary">
                            Track package
                        </button>
                    </a>
                </div>
            `;
        });
        
        ordersHTML += `
            <div class="order-container">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">Order Placed:</div>
                            <div>${formattedDate}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${formatCurrency(order.totalCents)}</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>

                <div class="order-details-grid">
                    ${itemsHTML}
                </div>
            </div>
        `;
    });
    
    if (orders.length === 0) {
        ordersHTML = `
            <div class="no-orders-message">
                <p>You haven't placed any orders yet.</p>
                <a href="amazon.html" class="button-primary">Start Shopping</a>
            </div>
        `;
    }
    
    document.querySelector('.orders-grid').innerHTML = ordersHTML;
    
    document.querySelectorAll('.js-buy-again').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
            
            // Use the imported updateCartQuantity function
            updateCartQuantity();
            
            button.innerHTML = '✓ Added';
            setTimeout(() => {
                button.innerHTML = `
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                `;
            }, 1500);
        });
    });
}

// Initialize the page
renderOrders();
updateCartQuantity(); // This now comes from the header.js utility