import {cart} from '../../data/cart.js';

export function updateCartQuantity() {
    let cartQuantity = 0;
    
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    
    const cartQuantityElements = document.querySelectorAll('.js-cart-quantity');
    cartQuantityElements.forEach((element) => {
        element.innerHTML = cartQuantity;
    });
}