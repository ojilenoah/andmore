const productGrid = document.querySelector(".product-grid");
const products = [...document.querySelectorAll(".product-card")];
const originalProductOrder = [...products];
const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#site-search");
const searchStatus = document.querySelector(".search-status");
const emptyState = document.querySelector(".empty-state");
const cartButton = document.querySelector(".cart-button");
const cartDrawer = document.querySelector(".cart-drawer");
const cartBackdrop = document.querySelector(".cart-backdrop");
const cartItemsContainer = document.querySelector(".drawer-items");
const whatsappOrderButton = document.querySelector(".whatsapp-order-button");
const cartCount = document.querySelector(".cart-count");
const cartHeaderTotal = document.querySelector(".cart-header-total");
const toast = document.querySelector(".toast");
const cart = new Map(readSharedCart());
const sortSelect = document.querySelector(".sort-select");
const showSelect = document.querySelector(".show-select");
const pagination = document.querySelector(".pagination");
let activeCategory = "all";
let currentPage = 1;
let pageSize = Number(showSelect.value);
let toastTimer;
let textSwapTimer;
let statusInitialized = false;

const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

function setAnimatedDigits(group, text, animate = true) {
  group.classList.remove("is-animating");
  group.replaceChildren();
  const chars = text.split("");
  chars.forEach((character, index) => {
    const digit = document.createElement("span");
    digit.className = "t-digit";
    digit.textContent = character;
    if (index === chars.length - 2) digit.dataset.stagger = "1";
    else if (index === chars.length - 1) digit.dataset.stagger = "2";
    group.append(digit);
  });
  group.setAttribute("aria-label", text);
  void group.offsetHeight;
  if (animate) group.classList.add("is-animating");
}

function setSearchStatus(text) {
  if (!statusInitialized) {
    searchStatus.textContent = text;
    statusInitialized = true;
    return;
  }
  if (searchStatus.textContent === text) return;

  clearTimeout(textSwapTimer);
  const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--text-swap-dur")) || 200;
  searchStatus.classList.remove("is-enter-start");
  searchStatus.classList.add("is-exit");
  textSwapTimer = setTimeout(() => {
    searchStatus.textContent = text;
    searchStatus.classList.remove("is-exit");
    searchStatus.classList.add("is-enter-start");
    void searchStatus.offsetHeight;
    searchStatus.classList.remove("is-enter-start");
  }, duration);
}

function setupProductCard(product) {
  const name = product.querySelector("h3").textContent;
  const quantityControl = document.createElement("div");
  quantityControl.className = "product-card-quantity";
  quantityControl.setAttribute("role", "group");
  quantityControl.setAttribute("aria-label", `${name} quantity in cart`);
  quantityControl.hidden = true;
  quantityControl.innerHTML = `
    <button type="button" data-product-action="decrease"><svg class="ui-icon" aria-hidden="true"><use href="#icon-minus"></use></svg></button>
    <span class="product-card-count">0</span>
    <button type="button" data-product-action="increase"><svg class="ui-icon" aria-hidden="true"><use href="#icon-plus"></use></svg></button>`;
  quantityControl.querySelector('[data-product-action="decrease"]').setAttribute("aria-label", `Remove one ${name}`);
  quantityControl.querySelector('[data-product-action="increase"]').setAttribute("aria-label", `Add one ${name}`);
  product.querySelector(".product-bottom").append(quantityControl);
}

function updateProductCard(product) {
  const item = cart.get(product.dataset.name);
  const quantity = item ? item.quantity : 0;
  const addButton = product.querySelector(".add-button");
  const quantityControl = product.querySelector(".product-card-quantity");

  addButton.hidden = quantity > 0;
  addButton.setAttribute("aria-label", `Add ${product.querySelector("h3").textContent} to cart`);
  quantityControl.hidden = quantity === 0;
  quantityControl.querySelector(".product-card-count").textContent = String(quantity);
  product.classList.toggle("in-cart", quantity > 0);
}

function getMatchingProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const matchingProducts = originalProductOrder.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.dataset.category === activeCategory;
    const matchesQuery = product.dataset.name.includes(query) || product.querySelector("h3").textContent.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (sortSelect.value === "low") matchingProducts.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  if (sortSelect.value === "high") matchingProducts.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  return matchingProducts;
}

function renderPagination(pageCount) {
  pagination.replaceChildren();
  if (pageCount <= 1) return;

  const addPageButton = (label, page, disabled, current = false) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-button";
    button.textContent = label;
    button.disabled = disabled;
    if (current) button.setAttribute("aria-current", "page");
    else button.dataset.page = String(page);
    pagination.append(button);
  };

  addPageButton("Previous", currentPage - 1, currentPage === 1);
  for (let page = 1; page <= pageCount; page += 1) {
    addPageButton(String(page), page, false, page === currentPage);
  }
  addPageButton("Next", currentPage + 1, currentPage === pageCount);
}

function filterProducts(resetPage = true, animate = true) {
  const matchingProducts = getMatchingProducts();
  const pageCount = Math.max(1, Math.ceil(matchingProducts.length / pageSize));
  if (resetPage) currentPage = 1;
  currentPage = Math.min(currentPage, pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageProducts = matchingProducts.slice(start, start + pageSize);
  const visibleProducts = new Set(pageProducts);
  const previousPositions = new Map();
  const canAnimate = animate
    && typeof Element.prototype.animate === "function"
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  products.forEach((product) => {
    product.getAnimations().forEach((animation) => animation.cancel());
    if (canAnimate && !product.hidden) previousPositions.set(product, product.getBoundingClientRect());
    product.hidden = !visibleProducts.has(product);
  });
  pageProducts.forEach((product) => {
    productGrid.append(product);
  });

  if (canAnimate) {
    pageProducts.forEach((product, index) => {
      const previous = previousPositions.get(product);
      const current = product.getBoundingClientRect();
      const options = {
        duration: 420,
        delay: Math.min(index * 24, 168),
        easing: "cubic-bezier(.22, 1, .36, 1)"
      };

      if (!previous) {
        product.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
          options
        );
        return;
      }

      const deltaX = previous.left - current.left;
      const deltaY = previous.top - current.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      product.animate(
        [
          { opacity: 0.82, transform: `translate(${deltaX}px, ${deltaY}px)` },
          { opacity: 1, transform: "translate(0, 0)" }
        ],
        options
      );
    });
  }

  emptyState.hidden = matchingProducts.length > 0;
  const query = searchInput.value.trim();
  const statusText = query || activeCategory !== "all"
    ? `${matchingProducts.length} ${matchingProducts.length === 1 ? "product" : "products"} found`
    : matchingProducts.length
      ? `Showing ${start + 1}–${Math.min(start + pageSize, matchingProducts.length)} of ${matchingProducts.length} products`
      : "No products to show";
  setSearchStatus(statusText);
  renderPagination(pageCount);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2300);
}

function renderCart(animateTotal = true) {
  let itemCount = 0;
  let subtotal = 0;
  cartItemsContainer.replaceChildren();

  if (cart.size === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "drawer-empty";
    emptyMessage.textContent = "Your cart is waiting for something good.";
    cartItemsContainer.append(emptyMessage);
  }

  cart.forEach((item, id) => {
    itemCount += item.quantity;
    subtotal += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "drawer-item";
    row.innerHTML = `
      <span class="drawer-product-icon" aria-hidden="true">${item.emoji}</span>
      <div>
        <span class="drawer-product-name"></span>
        <span class="drawer-unit-price">${formatPrice(item.price)} each</span>
        <div class="quantity-control">
          <button type="button" data-cart-action="decrease" data-product-id="${id}" aria-label="Remove one ${item.name}"><svg class="ui-icon" aria-hidden="true"><use href="#icon-minus"></use></svg></button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-action="increase" data-product-id="${id}" aria-label="Add one ${item.name}"><svg class="ui-icon" aria-hidden="true"><use href="#icon-plus"></use></svg></button>
        </div>
      </div>
      <span class="drawer-line-total">${formatPrice(item.price * item.quantity)}</span>`;
    row.querySelector(".drawer-product-name").textContent = item.name;
    cartItemsContainer.append(row);
  });

  cartCount.textContent = String(itemCount);
  setAnimatedDigits(cartHeaderTotal, formatPrice(subtotal), animateTotal);
  products.forEach(updateProductCard);
  document.querySelector(".drawer-count").textContent = `(${itemCount})`;
  document.querySelector(".drawer-total strong").textContent = formatPrice(subtotal);
  const orderLines = [...cart.values()].map((item) => `- ${item.name} x ${item.quantity}`);
  const orderMessage = [
    "Hi, I need these items:",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "Please confirm availability and delivery."
  ].join("\n");
  whatsappOrderButton.href = `https://wa.me/2348033351931?text=${encodeURIComponent(orderMessage)}`;
  whatsappOrderButton.hidden = cart.size === 0;
  saveSharedCart([...cart]);
}

function setCartOpen(open) {
  cartDrawer.classList.toggle("open", open);
  cartBackdrop.hidden = !open;
  cartDrawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("no-scroll", open);
  if (open) document.querySelector(".drawer-close").focus();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});
searchInput.addEventListener("input", filterProducts);

document.querySelectorAll("[data-filter]").forEach((control) => {
  control.addEventListener("click", () => {
    activeCategory = control.dataset.filter;
    searchInput.value = "";
    filterProducts();
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector(".clear-filters").addEventListener("click", () => {
  activeCategory = "all";
  searchInput.value = "";
  filterProducts();
});

productGrid.addEventListener("click", (event) => {
  const product = event.target.closest(".product-card");
  if (!product) return;

  const quantityButton = event.target.closest("[data-product-action]");
  if (quantityButton) {
    const id = product.dataset.name;
    const item = cart.get(id);
    if (!item) return;
    item.quantity += quantityButton.dataset.productAction === "increase" ? 1 : -1;
    if (item.quantity <= 0) cart.delete(id);
    else cart.set(id, item);
    renderCart();
    return;
  }

  const button = event.target.closest(".add-button");
  if (!button) return;

  const id = product.dataset.name;
  const item = cart.get(id) || {
    name: product.querySelector("h3").textContent,
    price: Number(product.dataset.price),
    emoji: product.querySelector(".product-emoji").textContent,
    quantity: 0
  };
  item.quantity += 1;
  cart.set(id, item);
  renderCart();
  showToast(`${item.name} added to your cart`);
});

cartItemsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;

  const item = cart.get(button.dataset.productId);
  if (!item) return;
  item.quantity += button.dataset.cartAction === "increase" ? 1 : -1;
  if (item.quantity <= 0) cart.delete(button.dataset.productId);
  else cart.set(button.dataset.productId, item);
  renderCart();
});

cartButton.addEventListener("click", () => setCartOpen(true));
document.querySelector(".drawer-close").addEventListener("click", () => setCartOpen(false));
document.querySelector(".continue-shopping").addEventListener("click", () => setCartOpen(false));
cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) setCartOpen(false);
});

sortSelect.addEventListener("change", () => filterProducts());
showSelect.addEventListener("change", () => {
  pageSize = Number(showSelect.value);
  filterProducts();
});
pagination.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button) return;
  currentPage = Number(button.dataset.page);
  filterProducts(false);
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});
document.querySelectorAll(".view-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".view-button").forEach((control) => {
      const selected = control === button;
      control.classList.toggle("is-active", selected);
      control.setAttribute("aria-pressed", String(selected));
    });
    productGrid.classList.toggle("is-list", button.dataset.view === "list");
    productGrid.classList.toggle("is-compact", button.dataset.view === "compact");
  });
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  document.querySelector(".newsletter-message").textContent = `Thanks — ${email.value} is on the list!`;
  event.currentTarget.reset();
});

document.querySelector(".checkout-button").addEventListener("click", (event) => {
  if (cart.size === 0) {
    event.preventDefault();
    showToast("Add a few good finds to your cart first");
    return;
  }

  const params = new URLSearchParams();
  params.set("items", JSON.stringify([...cart].map(([id, item]) => ({ id, quantity: item.quantity }))));
  event.currentTarget.href = `checkout.html?${params.toString()}`;
});

const heroCarousel = document.querySelector("[data-hero-carousel]");

if (heroCarousel) {
  const slides = [...heroCarousel.querySelectorAll("[data-hero-slide]")];
  const controls = [...heroCarousel.querySelectorAll(".hero-pagination button")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length !== controls.length || slides.length < 2) {
    console.error("Hero carousel requires at least two slides and one control per slide.");
  } else {
    let activeIndex = 0;
    let timer = null;
    let pointerInside = false;
    let hasFocus = false;

    function showSlide(index) {
      activeIndex = index;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
        if (isActive) controls[slideIndex].setAttribute("aria-current", "true");
        else controls[slideIndex].removeAttribute("aria-current");
      });
    }

    function stopRotation() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function syncRotation() {
      if (reducedMotion || pointerInside || hasFocus || document.hidden || timer !== null) return;
      timer = window.setInterval(() => showSlide((activeIndex + 1) % slides.length), 7000);
    }

    controls.forEach((control, index) => {
      control.addEventListener("click", () => {
        showSlide(index);
        stopRotation();
        syncRotation();
      });
    });

    heroCarousel.addEventListener("mouseenter", () => {
      pointerInside = true;
      stopRotation();
    });
    heroCarousel.addEventListener("mouseleave", () => {
      pointerInside = false;
      syncRotation();
    });
    heroCarousel.addEventListener("focusin", () => {
      hasFocus = true;
      stopRotation();
    });
    heroCarousel.addEventListener("focusout", (event) => {
      if (!heroCarousel.contains(event.relatedTarget)) {
        hasFocus = false;
        syncRotation();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopRotation();
      else syncRotation();
    });

    syncRotation();
  }
}

products.forEach(setupProductCard);
renderCart(false);
filterProducts(true, false);
