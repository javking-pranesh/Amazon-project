export let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Clean up any empty orders immediately
cleanupEmptyOrders();

export function addOrder(order) {
  // Add new order to the beginning of the array
  orders.unshift(order);
  saveToStorage();
}

export function getOrder(orderId) {
  let matchingOrder;
  
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });
  
  return matchingOrder;
}

export function removeOrder(orderId) {
  const newOrders = [];
  
  orders.forEach((order) => {
    if (order.id !== orderId) {
      newOrders.push(order);
    }
  });
  
  orders = newOrders;
  saveToStorage();
}

// New function to remove empty orders
export function cleanupEmptyOrders() {
  const validOrders = [];
  let removedCount = 0;
  
  orders.forEach((order) => {
    // Check if order has items and items array is not empty
    if (order.items && order.items.length > 0) {
      validOrders.push(order);
    } else {
      removedCount++;
    }
  });
  
  if (removedCount > 0) {
    orders = validOrders;
    saveToStorage();
    console.log(`Cleaned up ${removedCount} empty order(s)`);
  }
}

// New function to check if an order is valid
export function isValidOrder(order) {
  return order && 
         order.items && 
         order.items.length > 0 && 
         order.totalCents > 0;
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function generateOrderId() {
  const datePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${datePart}-${randomPart}`;
}

export function formatOrderDate(date) {
  const options = { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}