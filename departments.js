const departments = [
  ["beverages", "Beverages", "75", "drink"],
  ["beverage-supplements", "Beverages & Supplements", "2", "care"],
  ["biscuits-snacks", "Biscuits & Snacks", "33", "cookie"],
  ["body-care-toiletries", "Body Care & Toiletries", "20", "care"],
  ["butchery", "Butchery", "1", "meat"],
  ["canned-food", "Canned Food", "2", "can"],
  ["cereals", "Cereals", "9", "wheat"],
  ["children-products", "Children Products", "4", "gift"],
  ["cleaning-aids", "Cleaning Aids", "6", "sparkle"],
  ["condiments", "Condiments", "18", "can"],
  ["confectionery", "Confectionery", "25", "candy"],
  ["dairy-cheese-eggs", "Dairy, Cheese & Eggs", "29", "milk"],
  ["drinks", "Drinks", "119", "drink"],
  ["frozen-foods", "Frozen Foods", "16", "snowflake"],
  ["fruits-vegetables", "Fruits & Vegetables", "5", "fruit"],
  ["gifts-celebrations", "Gifts & Celebrations", "2", "gift"],
  ["grains-pasta", "Groceries, Grains & Pasta", "13", "wheat"],
  ["households", "Households", "8", "house"],
  ["packaged-breads", "Packaged Breads", "1", "bread"],
  ["stationeries", "Stationeries", "12", "pen"],
  ["tobacco", "Tobacco", "3", "produce"],
  ["uncategorized", "Uncategorized", "1", "grid"],
  ["wines-spirits", "Wines & Spirits", "19", "wine"]
];

const iconPaths = {
  produce: '<path d="M12 20c-5.3 0-8-3.6-8-8 4.7 0 8 2.7 8 8Zm0 0c0-6 2.8-10 8-12 0 5.2-2.8 12-8 12Zm0 0v-7"/>',
  drink: '<path d="M8 3h8v3l-1 2v12H9V8L8 6V3Zm1 7h6m-2-7 3-2"/>',
  cookie: '<path d="M20 13a8 8 0 1 1-9-9 4.5 4.5 0 0 0 9 9Zm-12-3h.01M12 15h.01M15 9h.01"/>',
  care: '<path d="M9 3h6v3H9zm1 3v2H7.5A1.5 1.5 0 0 0 6 9.5v10A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 16.5 8H14V6m-5 7h6"/>',
  meat: '<path d="M14.5 4.5c2-2 5.5-.7 5.5 2.2 0 1.2-.7 2.1-1.7 2.8l-7.7 7.7a5 5 0 1 1-7.1-7.1l7.7-7.7c.8-.8 2.1-1 3.3-.5Zm1 4h.01M9 14h.01M7 17h.01"/>',
  can: '<path d="M6 5c0-1.1 2.7-2 6-2s6 .9 6 2v14c0 1.1-2.7 2-6 2s-6-.9-6-2V5Zm0 0c0 1.1 2.7 2 6 2s6-.9 6-2M6 18c0 1.1 2.7 2 6 2s6-.9 6-2"/>',
  wheat: '<path d="M12 22V3m0 5c-3.2 0-5-1.4-5-4 3.2 0 5 1.4 5 4Zm0 5c-3.2 0-5-1.4-5-4 3.2 0 5 1.4 5 4Zm0 5c-3.2 0-5-1.4-5-4 3.2 0 5 1.4 5 4Zm0-8c3.2 0 5-1.4 5-4-3.2 0-5 1.4-5 4Zm0 6c3.2 0 5-1.4 5-4-3.2 0-5 1.4-5 4Z"/>',
  gift: '<path d="M3 10h18v11H3zM2 7h20v3H2zm10 0v14M12 7H8.5a2.5 2.5 0 1 1 2.4-3.2L12 7Zm0 0h3.5a2.5 2.5 0 1 0-2.4-3.2L12 7Z"/>',
  sparkle: '<path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  candy: '<path d="m7 9-4-3v5l4 1m10-3 4-3v5l-4 1M7 9h10v8H7zm0 4-4 1v5l4-3m10-3 4 1v5l-4-3"/>',
  milk: '<path d="M8 3h8l2 4v14H6V7l2-4Zm0 0 4 4 4-4M6 7h12m-9 6h6"/>',
  snowflake: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8 4l4 3 4-3M8 20l4-3 4 3M3.5 11l4-1 1-4m12 7-4 1-1 4"/>',
  fruit: '<path d="M12 8c-1.4-2.1-5.4-2.8-7.4.4-2.8 4.5 1 12.6 5.7 12.6 1 0 1.2-.6 2.7-.6s1.7.6 2.7.6c4.7 0 8.5-8.1 5.7-12.6C19.4 5.2 15.4 5.9 14 8c-.6.7-1.4.7-2 0Zm0 0c0-3 1.5-4.5 4-5"/>',
  house: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Zm6 11v-7h6v7"/>',
  bread: '<path d="M4 20a2 2 0 0 1-2-2v-5a10 10 0 0 1 20 0v5a2 2 0 0 1-2 2H4Zm4-10v3m4-5v4m4-2v3"/>',
  pen: '<path d="m4 16-1 5 5-1L21 7l-4-4L4 16Zm10-10 4 4M4 16l4 4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  wine: '<path d="M7 3h10v5a5 5 0 0 1-10 0V3Zm5 10v7m-4 1h8M7 8h10"/>'
};

const list = document.querySelector("#department-list");
departments.forEach(([slug, name, count, icon]) => {
  const link = document.createElement("a");
  link.className = "department-card";
  link.href = `department.html?category=${encodeURIComponent(slug)}`;
  link.innerHTML = `<span class="department-icon" aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24">${iconPaths[icon]}</svg></span><span></span>`;
  link.querySelector("span:last-child").append(document.createTextNode(`${name} `));
  const countLabel = document.createElement("small");
  countLabel.textContent = `(${count})`;
  link.querySelector("span:last-child").append(countLabel);
  list.append(link);
});
