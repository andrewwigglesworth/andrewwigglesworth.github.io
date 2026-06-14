const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

window.addEventListener("DOMContentLoaded", () => {
  body.classList.add("page-ready");

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("is-active");
    }
  });
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".scroll-reveal").forEach((element, index) => {
  element.style.setProperty("--reveal-delay", index % 5);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

document.querySelectorAll(".scroll-reveal").forEach((element) => {
  observer.observe(element);
});

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href);

    if (url.origin !== window.location.origin || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    event.preventDefault();
    body.classList.add("page-exit");

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 190);
  });
});
