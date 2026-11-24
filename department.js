const departmentsBySlug = {
  beverages: { title: "Beverages", group: "beverages", description: "Drinks and refreshments for every day." },
  "beverage-supplements": { title: "Beverages & Supplements", group: "beverages", description: "Browse beverage and supplement picks." },
  "biscuits-snacks": { title: "Biscuits & Snacks", group: "snacks", description: "Find something tasty for snack time." },
  "body-care-toiletries": { title: "Body Care & Toiletries", group: "household", description: "Everyday personal care essentials." },
  butchery: { title: "Butchery", group: "empty", description: "Fresh picks from the butchery aisle." },
  "canned-food": { title: "Canned Food", group: "groceries", description: "Convenient pantry essentials." },
  cereals: { title: "Cereals", group: "groceries", description: "Breakfast favourites and pantry staples." },
  "children-products": { title: "Children Products", group: "empty", description: "Everyday picks for little ones." },
  "cleaning-aids": { title: "Cleaning Aids", group: "household", description: "Keep your home fresh and clean." },
  condiments: { title: "Condiments", group: "groceries", description: "Add flavour to everyday meals." },
  confectionery: { title: "Confectionery", group: "snacks", description: "Sweet treats for sharing and enjoying." },
  "dairy-cheese-eggs": { title: "Dairy, Cheese & Eggs", group: "groceries", description: "Everyday fridge and breakfast essentials." },
  drinks: { title: "Drinks", group: "beverages", description: "Refreshments for the whole family." },
  "frozen-foods": { title: "Frozen Foods", group: "empty", description: "Convenient frozen favourites." },
  "fruits-vegetables": { title: "Fruits & Vegetables", group: "groceries", description: "Fresh picks for your kitchen." },
  "gifts-celebrations": { title: "Gifts & Celebrations", group: "empty", description: "Thoughtful finds for special occasions." },
  "grains-pasta": { title: "Groceries, Grains & Pasta", group: "groceries", description: "Pantry essentials for everyday meals." },
  households: { title: "Households", group: "household", description: "Useful essentials for every room." },
  "packaged-breads": { title: "Packaged Breads", group: "groceries", description: "Packaged bread and bakery favourites." },
  stationeries: { title: "Stationeries", group: "empty", description: "School and office essentials." },
  tobacco: { title: "Tobacco", group: "empty", description: "Explore this department." },
  uncategorized: { title: "Uncategorized", group: "empty", description: "Explore additional store finds." },
  "wines-spirits": { title: "Wines & Spirits", group: "empty", description: "Browse the wines and spirits department." }
};

const products = [
  { id: "indomie chicken noodles", group: "groceries", name: "Instant Noodles, Chicken Flavour", price: 700, emoji: "🍜", visual: "visual-noodles", label: "INSTANT NOODLES" },
  { id: "malt drink", group: "beverages", name: "Malt Drink, 330 ml", price: 1200, emoji: "🥤", visual: "visual-malt", label: "MALT DRINK" },
  { id: "chocolate chip cookies", group: "snacks", name: "Chocolate Chip Cookies", price: 950, emoji: "🍪", visual: "visual-cookies", label: "CHOCOLATE COOKIES" },
  { id: "laundry detergent", group: "household", name: "Fresh Laundry Detergent", price: 3450, emoji: "🧴", visual: "visual-clean", label: "FRESH & CLEAN" },
  { id: "long grain rice", group: "groceries", name: "Premium Long Grain Rice, 5 kg", price: 5200, emoji: "🍚", visual: "visual-rice", label: "LONG GRAIN RICE" },
  { id: "orange juice", group: "beverages", name: "Orange Juice, 1 Litre", price: 1800, emoji: "🍊", visual: "visual-juice", label: "100% ORANGE" },
  { id: "potato crisps", group: "snacks", name: "Classic Potato Crisps", price: 650, emoji: "🥔", visual: "visual-crisps", label: "CRUNCHY CRISPS" },
  { id: "paper towels", group: "household", name: "Everyday Paper Towels, 2 Pack", price: 1250, emoji: "🧻", visual: "visual-towels", label: "SOFT & STRONG" },
  { id: "tomato pasta sauce", group: "groceries", name: "Tomato Pasta Sauce, 500 g", price: 1450, emoji: "🍅", visual: "visual-tomato", label: "TOMATO SAUCE" },
  { id: "chocolate wafer biscuits", group: "snacks", name: "Chocolate Wafer Biscuits", price: 800, emoji: "🍫", visual: "visual-wafer", label: "CHOCOLATE WAFERS" },
  { id: "sparkling grape drink", group: "beverages", name: "Sparkling Grape Drink, 750 ml", price: 2650, emoji: "🍇", visual: "visual-grape", label: "SPARKLING GRAPE" },
  { id: "dishwashing liquid", group: "household", name: "Fresh Dishwashing Liquid", price: 1850, emoji: "🧽", visual: "visual-dish", label: "DISH WASH" }
];

const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;
const params = new URLSearchParams(window.location.search);
const categoryKey = params.get("category") || "";
const department = departmentsBySlug[categoryKey];
const title = department ? department.title : "Department not found";
document.title = `${title} | And More Value Mart`;
document.querySelector(".department-name").textContent = title;
document.querySelector(".breadcrumb-current").textContent = title;
document.querySelector(".department-description").textContent = department
  ? department.description
  : "Choose a department from the directory to explore its products.";

const departmentProducts = document.querySelector(".department-products");
const visibleProducts = products.filter((product) => department && product.group === department.group);
visibleProducts.forEach((product) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.name = product.id;
  card.dataset.price = String(product.price);
  card.innerHTML = `
    <div class="product-visual ${product.visual}"><span class="product-emoji" aria-hidden="true">${product.emoji}</span><span class="pack-label">${product.label}</span></div>
    <div class="product-info"><span class="stock"><i></i> In stock</span><h3></h3><div class="product-bottom"><strong class="price">${formatPrice(product.price)}</strong><button class="add-button" type="button">Add to cart <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h2l2.6 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L21 8H5"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/><path d="M13 9v5M10.5 11.5h5"/></svg></button></div></div>`;
  card.querySelector("h3").textContent = product.name;
  const quantityControl = document.createElement("div");
  quantityControl.className = "product-card-quantity";
  quantityControl.setAttribute("role", "group");
  quantityControl.setAttribute("aria-label", `${product.name} quantity in cart`);
  quantityControl.hidden = true;
  quantityControl.innerHTML = `
    <button type="button" data-product-action="decrease" aria-label="Remove one ${product.name}"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button>
    <span class="product-card-count">0</span>
    <button type="button" data-product-action="increase" aria-label="Add one ${product.name}"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>`;
  card.querySelector(".product-bottom").append(quantityControl);
  departmentProducts.append(card);
});

const cart = new Map(readSharedCart());

function updateProductCard(productId) {
  const card = [...departmentProducts.querySelectorAll(".product-card")].find((item) => item.dataset.name === productId);
  if (!card) return;
  const item = cart.get(productId);
  const quantity = item ? item.quantity : 0;
  card.querySelector(".add-button").hidden = quantity > 0;
  card.querySelector(".product-card-quantity").hidden = quantity === 0;
  card.querySelector(".product-card-count").textContent = String(quantity);
  card.classList.toggle("in-cart", quantity > 0);
}

function changeProductQuantity(product, change) {
  const item = cart.get(product.id) || { ...product, quantity: 0 };
  item.quantity += change;
  if (item.quantity <= 0) cart.delete(product.id);
  else cart.set(product.id, item);
  saveSharedCart([...cart]);
  updateCartCount(cart);
  updateProductCard(product.id);
  if (change > 0) document.querySelector(".department-toast").textContent = `${product.name} added to your cart`;
}

visibleProducts.forEach((product) => {
  const card = [...departmentProducts.querySelectorAll(".product-card")].find((item) => item.dataset.name === product.id);
  card.querySelector(".add-button").addEventListener("click", () => changeProductQuantity(product, 1));
  card.querySelector(".product-card-quantity").addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-action]");
    if (button) changeProductQuantity(product, button.dataset.productAction === "increase" ? 1 : -1);
  });
});

function updateCartCount(cart) {
  const count = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector(".cart-count").textContent = String(count);
}

updateCartCount(new Map(readSharedCart()));
visibleProducts.forEach((product) => updateProductCard(product.id));
document.querySelector(".department-empty").hidden = visibleProducts.length > 0;
