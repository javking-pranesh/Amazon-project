import {products, getProduct} from '../../data/products.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {cart} from '../../data/cart.js';
import {formatCurrency} from '../utils/money.js';
import {addOrder, generateOrderId} from '../../data/orders.js';

export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let cartItemCount = 0;
    
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        productPriceCents += product.priceCents * cartItem.quantity;
        
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
        
        cartItemCount += cartItem.quantity;
    });
    
    const totalBeforeTax = productPriceCents + shippingPriceCents;
    const taxPriceCents = totalBeforeTax * 0.1;
    const totalPriceCents = totalBeforeTax + taxPriceCents;
    
    const paymentSummaryHTML = `
    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartItemCount}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxPriceCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalPriceCents)}</div>
          </div>
          
          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
    
    // Add event listener to the place order button
    const placeOrderButton = document.querySelector('.js-place-order');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', onPlaceOrder);
    }
}

function onPlaceOrder() {
    // Create the order object
    const order = {
        id: generateOrderId(),
        date: new Date(),
        totalCents: calculateOrderTotal(),
        items: cart.map((cartItem) => {
            const product = getProduct(cartItem.productId);
            const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
            
            return {
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                deliveryOptionId: cartItem.deliveryOptionId,
                estimatedDeliveryDate: calculateDeliveryDate(deliveryOption.deliveryDays),
                priceWhenOrdered: product.priceCents,
                nameWhenOrdered: product.name,
                imageWhenOrdered: product.image
            };
        })
    };
    
    // Save the order
    addOrder(order);
    
    // Clear the cart
    cart.length = 0;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to orders page
    window.location.href = 'orders.html';
}

function calculateOrderTotal() {
    let total = 0;
    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        total += (product.priceCents * cartItem.quantity) + deliveryOption.priceCents;
    });
    return total + (total * 0.1); // Add 10% tax
}

function calculateDeliveryDate(deliveryDays) {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    return deliveryDate;
}