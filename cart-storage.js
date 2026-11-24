const sharedCartKey = "and-more-value-mart-cart";

function readSharedCart() {
  const saved = localStorage.getItem(sharedCartKey);
  if (!saved) return [];
  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new TypeError("Saved cart data is not valid.");
  return parsed;
}

function saveSharedCart(entries) {
  localStorage.setItem(sharedCartKey, JSON.stringify(entries));
}
