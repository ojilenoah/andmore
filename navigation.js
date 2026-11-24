const dropdownToggles = [...document.querySelectorAll(".nav-dropdown-toggle")];
const hoverPointerAvailable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const hoverDropdownsEnabled = () => hoverPointerAvailable && window.matchMedia("(min-width: 641px)").matches;
const dropdownCloseTimers = new WeakMap();
const dropdownCloseMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dropdown-close-dur")) || 150;

function positionMobileDropdown(menu) {
  if (!menu.classList.contains("nav-dropdown-menu") || !window.matchMedia("(max-width: 640px)").matches) return;
  const trigger = menu.previousElementSibling;
  if (!trigger) return;
  const nav = menu.closest(".main-nav");
  const top = nav ? nav.getBoundingClientRect().bottom : trigger.getBoundingClientRect().bottom;
  menu.style.setProperty("--mobile-dropdown-top", `${Math.round(top)}px`);
}

function animateDropdown(menu, open) {
  const timer = dropdownCloseTimers.get(menu);
  if (timer) clearTimeout(timer);

  if (open) {
    positionMobileDropdown(menu);
    menu.hidden = false;
    menu.classList.remove("is-closing");
    requestAnimationFrame(() => {
      if (!menu.hidden && !menu.classList.contains("is-closing")) menu.classList.add("is-open");
    });
    return;
  }

  window.addEventListener("resize", () => {
    dropdownToggles.forEach((toggle) => {
      if (toggle.getAttribute("aria-expanded") === "true") positionMobileDropdown(toggle.nextElementSibling);
    });
  });

  if (menu.hidden) return;
  menu.classList.remove("is-open");
  menu.classList.add("is-closing");
  dropdownCloseTimers.set(menu, setTimeout(() => {
    menu.hidden = true;
    menu.classList.remove("is-closing");
  }, dropdownCloseMs));
}

function closeDropdown(toggle) {
  toggle.setAttribute("aria-expanded", "false");
  animateDropdown(toggle.nextElementSibling, false);
}

function closeDropdowns(exceptToggle) {
  dropdownToggles.forEach((toggle) => {
    if (toggle !== exceptToggle) closeDropdown(toggle);
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    if (toggle.dataset.desktopHref && window.matchMedia("(min-width: 641px)").matches) {
      window.location.href = toggle.dataset.desktopHref;
      return;
    }
    const opening = toggle.getAttribute("aria-expanded") !== "true";
    if (hoverDropdownsEnabled() && !opening) return;
    closeDropdowns(opening ? toggle : null);
    toggle.setAttribute("aria-expanded", String(opening));
    animateDropdown(toggle.nextElementSibling, opening);
  });
});

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const open = () => {
    closeDropdowns(toggle);
    toggle.setAttribute("aria-expanded", "true");
    animateDropdown(toggle.nextElementSibling, true);
  };
  const close = () => {
    if (dropdown.contains(document.activeElement)) return;
    closeDropdown(toggle);
  };
  dropdown.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) close();
  });
  dropdown.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" || event.target !== toggle) return;
    event.preventDefault();
    open();
    const firstItem = toggle.nextElementSibling.querySelector("a, button");
    if (firstItem) firstItem.focus();
  });
  if (hoverPointerAvailable) {
    dropdown.addEventListener("pointerenter", () => {
      if (hoverDropdownsEnabled()) open();
    });
    dropdown.addEventListener("pointerleave", () => {
      if (hoverDropdownsEnabled()) close();
    });
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    if (!open) closeDropdowns();
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mainNav.classList.toggle("open", open);
  });
  mainNav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    closeDropdowns();
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
}

const locationPicker = document.querySelector(".location-picker");
const locationMenu = document.querySelector(".location-menu");
const locationControl = document.querySelector(".location-control");

if (locationPicker && locationMenu && locationControl) {
  const setLocationMenuOpen = (open) => {
    locationPicker.setAttribute("aria-expanded", String(open));
    animateDropdown(locationMenu, open);
  };
  const locationSearch = locationMenu.querySelector(".location-search input");
  const locationOptions = [...locationMenu.querySelectorAll("[data-location]")];
  const locationNoResults = locationMenu.querySelector(".location-no-results");

  locationPicker.addEventListener("click", () => {
    const opening = locationPicker.getAttribute("aria-expanded") !== "true";
    if (hoverDropdownsEnabled() && !opening) return;
    setLocationMenuOpen(opening);
  });
  locationMenu.addEventListener("click", (event) => {
    const option = event.target.closest("[data-location]");
    if (!option) return;
    locationControl.querySelector(".location-copy strong").textContent = option.dataset.location;
    setLocationMenuOpen(false);
  });
  if (locationSearch) {
    locationSearch.addEventListener("input", () => {
      const query = locationSearch.value.trim().toLowerCase();
      let visibleOptions = 0;
      locationOptions.forEach((option) => {
        const matches = option.textContent.toLowerCase().includes(query);
        option.hidden = !matches;
        if (matches) visibleOptions += 1;
      });
      locationNoResults.hidden = visibleOptions > 0;
    });
  }
  if (hoverPointerAvailable) {
    locationControl.addEventListener("pointerenter", () => {
      if (hoverDropdownsEnabled()) setLocationMenuOpen(true);
    });
    locationControl.addEventListener("pointerleave", () => {
      if (!hoverDropdownsEnabled()) return;
      if (!locationControl.contains(document.activeElement)) setLocationMenuOpen(false);
    });
  }
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".location-control")) setLocationMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setLocationMenuOpen(false);
  });
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) closeDropdowns();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDropdowns();
});
