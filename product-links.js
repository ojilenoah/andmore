function addProductDetailLinks(card) {
  const id = card.dataset.name && card.dataset.name.trim().toLowerCase();
  const heading = card.querySelector(".product-info h3");
  const visual = card.querySelector(".product-visual");
  if (!id || !heading || !visual || visual.parentElement.classList.contains("product-card-visual-link")) return;

  const href = `product.html?id=${encodeURIComponent(id)}`;
  const visualLink = document.createElement("a");
  visualLink.className = "product-card-visual-link";
  visualLink.href = href;
  visualLink.setAttribute("aria-label", `View ${heading.textContent.trim()} details`);
  visual.replaceWith(visualLink);
  visualLink.append(visual);

  const titleLink = document.createElement("a");
  titleLink.className = "product-title-link";
  titleLink.href = href;
  heading.replaceWith(titleLink);
  titleLink.append(heading);
}
