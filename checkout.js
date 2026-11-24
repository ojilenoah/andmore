const catalog = Object.fromEntries(window.andMoreProducts.map((product) => [product.id, product]));

const itemsContainer = document.querySelector(".order-items");
const summaryEmpty = document.querySelector(".summary-empty");
const summaryCount = document.querySelector(".summary-count");
const checkoutMessage = document.querySelector(".checkout-message");
const placeOrderButton = document.querySelector(".place-order");
const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

let requestedItems = [];
let invalidBasket = false;
const serializedItems = new URLSearchParams(window.location.search).get("items");

function resolveCheckoutItem(id, quantity) {
  if (typeof id !== "string" || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
    invalidBasket = true;
    return null;
  }
  const normalizedId = id.trim().toLowerCase();
  const product = catalog[normalizedId];
  if (!product) {
    invalidBasket = true;
    return null;
  }
  return { ...product, id: normalizedId, quantity };
}

if (serializedItems) {
  try {
    const parsedItems = JSON.parse(serializedItems);
    if (!Array.isArray(parsedItems)) throw new SyntaxError("Basket must be a list.");
    requestedItems = parsedItems.flatMap((entry) => {
      const item = resolveCheckoutItem(entry && entry.id, entry && entry.quantity);
      return item ? [item] : [];
    });
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    invalidBasket = true;
  }
} else {
  requestedItems = readSharedCart().flatMap(([id, item]) => {
    const resolvedItem = resolveCheckoutItem(id, item && item.quantity);
    return resolvedItem ? [resolvedItem] : [];
  });
}

let itemCount = 0;
let subtotal = 0;
requestedItems.forEach((item) => {
  itemCount += item.quantity;
  subtotal += item.price * item.quantity;

  const row = document.createElement("article");
  row.className = "checkout-item";
  row.innerHTML = `
    <span class="checkout-item-visual" aria-hidden="true">${item.emoji}</span>
    <span class="checkout-item-copy"><strong></strong><span>Qty ${item.quantity} · ${formatPrice(item.price)} each</span></span>
    <strong class="checkout-item-total">${formatPrice(item.price * item.quantity)}</strong>`;
  row.querySelector(".checkout-item-copy strong").textContent = item.name;
  itemsContainer.append(row);
});

document.querySelector(".summary-subtotal").textContent = formatPrice(subtotal);
document.querySelector(".summary-total-amount").textContent = formatPrice(subtotal);
summaryCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
summaryEmpty.hidden = itemCount > 0;
placeOrderButton.disabled = itemCount === 0;

if (invalidBasket) {
  checkoutMessage.textContent = "Some cart details could not be loaded. Please return to the store and try again.";
} else if (itemCount === 0) {
  checkoutMessage.textContent = "Your cart is empty. Add products before checking out.";
}

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (itemCount === 0) {
    checkoutMessage.textContent = "Your cart is empty. Add products before checking out.";
    return;
  }
  checkoutMessage.textContent = "Your details are ready. Online payment is not connected in this preview.";
});
