export let orders = JSON.parse(localStorage.getItem('orders')) || [];

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
