const productQuery = new URLSearchParams(window.location.search);
const productId = (productQuery.get("id") || "").trim().toLowerCase();
const product = window.andMoreProducts.find((item) => item.id === productId);
const productContent = document.querySelector(".product-detail-content");
const productNotFound = document.querySelector(".product-not-found");
const productReviewForm = document.querySelector(".product-review-form");
const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

if (!product) {
  document.title = "Product not found | And More Value Mart";
  productContent.hidden = true;
  productNotFound.hidden = false;
} else {
  document.title = `${product.name} | And More Value Mart`;
  document.querySelector('meta[name="description"]').content = product.description;
  document.querySelector(".breadcrumb-current").textContent = product.name;
  const productCategoryLink = document.querySelector(".product-breadcrumb-category");
  productCategoryLink.textContent = product.category;
  productCategoryLink.href = `department.html?category=${encodeURIComponent(product.categorySlug)}`;
  document.querySelector(".product-detail-title").textContent = product.name;
  document.querySelector(".product-sku").textContent = `SKU: ${product.sku}`;
  document.querySelector(".detail-sku-value").textContent = product.sku;
  document.querySelector(".detail-category-link").textContent = product.category;
  document.querySelector(".detail-category-link").href = `department.html?category=${encodeURIComponent(product.categorySlug)}`;
  document.querySelector(".detail-unit").textContent = product.unit;
  document.querySelector(".detail-price").textContent = formatPrice(product.price);
  document.querySelector(".detail-description").textContent = product.description;
  document.querySelector(".detail-product-visual").classList.add(product.visual);
  document.querySelector(".detail-product-emoji").textContent = product.emoji;

  const quantityValue = document.querySelector(".detail-quantity-value");
  const cartCount = document.querySelector(".cart-count");
  const cartStatus = document.querySelector(".detail-cart-status");
  const addButton = document.querySelector(".detail-add-button");
  const whatsappButton = document.querySelector(".detail-whatsapp-button");
  let selectedQuantity = 1;
  const cart = new Map();

  readSharedCart().forEach(([savedId, savedItem]) => {
    const id = String(savedId).trim().toLowerCase();
    const existing = cart.get(id);
    if (existing) existing.quantity += savedItem.quantity;
    else cart.set(id, { ...savedItem, id });
  });

  function updateCartCount() {
    const count = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = String(count);
  }

  function updateWhatsAppOrder() {
    const message = [
      "Hi, I would like to order:",
      `- ${product.name} x ${selectedQuantity}`,
      `Subtotal: ${formatPrice(product.price * selectedQuantity)}`,
      "Please confirm availability and delivery."
    ].join("\n");
    whatsappButton.href = `https://wa.me/2348033351931?text=${encodeURIComponent(message)}`;
  }

  function updateCartStatus(message) {
    const existing = cart.get(product.id);
    cartStatus.textContent = message || (existing ? `${existing.quantity} in your cart` : "");
  }

  document.querySelectorAll("[data-quantity-change]").forEach((button) => {
    button.addEventListener("click", () => {
      const change = Number(button.dataset.quantityChange);
      selectedQuantity = Math.min(99, Math.max(1, selectedQuantity + change));
      quantityValue.textContent = String(selectedQuantity);
      updateWhatsAppOrder();
    });
  });

  addButton.addEventListener("click", () => {
    const existing = cart.get(product.id);
    const currentQuantity = existing ? existing.quantity : 0;
    if (currentQuantity + selectedQuantity > 99) {
      updateCartStatus("Cart limit reached: a maximum of 99 per product.");
      return;
    }

    cart.set(product.id, {
      ...product,
      ...(existing || {}),
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: currentQuantity + selectedQuantity
    });
    saveSharedCart([...cart]);
    updateCartCount();
    updateCartStatus(`${selectedQuantity} added to your cart.`);
  });

  productReviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const review = new FormData(productReviewForm);
    const message = [
      `Product review: ${product.name}`,
      `Rating: ${review.get("rating")}/5`,
      `Name: ${review.get("name")}`,
      `Review: ${review.get("review")}`
    ].join("\n");
    window.open(`https://wa.me/2348033351931?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  updateCartCount();
  updateCartStatus();
  updateWhatsAppOrder();
}
