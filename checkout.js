const catalog = {
  "indomie chicken noodles": { name: "Instant Noodles, Chicken Flavour", price: 700, emoji: "🍜" },
  "malt drink": { name: "Malt Drink, 330 ml", price: 1200, emoji: "🥤" },
  "chocolate chip cookies": { name: "Chocolate Chip Cookies", price: 950, emoji: "🍪" },
  "laundry detergent": { name: "Fresh Laundry Detergent", price: 3450, emoji: "🧴" },
  "long grain rice": { name: "Premium Long Grain Rice, 5 kg", price: 5200, emoji: "🍚" },
  "orange juice": { name: "Orange Juice, 1 Litre", price: 1800, emoji: "🍊" },
  "potato crisps": { name: "Classic Potato Crisps", price: 650, emoji: "🥔" },
  "paper towels": { name: "Everyday Paper Towels, 2 Pack", price: 1250, emoji: "🧻" },
  "tomato pasta sauce": { name: "Tomato Pasta Sauce, 500 g", price: 1450, emoji: "🍅" },
  "chocolate wafer biscuits": { name: "Chocolate Wafer Biscuits", price: 800, emoji: "🍫" },
  "sparkling grape drink": { name: "Sparkling Grape Drink, 750 ml", price: 2650, emoji: "🍇" },
  "dishwashing liquid": { name: "Fresh Dishwashing Liquid", price: 1850, emoji: "🧽" }
};

const itemsContainer = document.querySelector(".order-items");
const summaryEmpty = document.querySelector(".summary-empty");
const summaryCount = document.querySelector(".summary-count");
const checkoutMessage = document.querySelector(".checkout-message");
const placeOrderButton = document.querySelector(".place-order");
const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

let requestedItems = [];
let invalidBasket = false;
const serializedItems = new URLSearchParams(window.location.search).get("items");

if (serializedItems) {
  try {
    const parsedItems = JSON.parse(serializedItems);
    if (!Array.isArray(parsedItems)) throw new SyntaxError("Basket must be a list.");
    requestedItems = parsedItems.flatMap((entry) => {
      if (!entry || typeof entry.id !== "string" || !catalog[entry.id] || !Number.isSafeInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > 99) {
        invalidBasket = true;
        return [];
      }
      return [{ ...catalog[entry.id], id: entry.id, quantity: entry.quantity }];
    });
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    invalidBasket = true;
  }
} else {
  requestedItems = readSharedCart().map(([id, item]) => ({ id, quantity: item.quantity }));
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
