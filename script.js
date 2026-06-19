/*
  script.js: Shared website interactions

  JavaScript comments are visible in GitHub code but not on the website.
  This file controls:
    - Page fade-in
    - Active navigation link
    - Mobile Menu
    - Scroll-reveal animation
    - Fade-out before internal page navigation
*/

/* Store commonly used page elements in variables. */
const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

/* 
  Get the current filename from the browser URL.
  Example:
    /about.html becomes about.html
  If there is no filename, use index.html.
*/
const currentPage = window.location.pathname.split("/").pop() || "index.html";

/* ===== PAGE STARTUP AND ACTIVE NAV LINK ===== */
window.addEventListener("DOMContentLoaded", () => {

  /*
    style.css starts the body with opacity: 0.
    This class makes the page visible and starts the fade-in transition.
  */
  body.classList.add("page-ready");

  /* 
    Check every main navigation link.
    Add "is active" when its href matches the current filename.
  */
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    
    if (href === currentPage) {
      link.classList.add("is-active");
    }
  });
});

/* ===== MOBILE NAVIGATION ===== */
/*
  Only add the click event if both the mobile button and nav exist.
  This avoids JavaScript errors if either element is missing.
*/
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    /*
      toggle() adds is-open when it is absent and removes it when present.
      It returns true when the class is now present.
    */
    const isOpen = siteNav.classList.toggle("is-open");

    /*
      Apply the same state to the button.
      CSS changes the hamburger lines into an X when this class exists.
    */
    navToggle.classList.toggle("is-open", isOpen);
    
    /*
      Keep the accessibility state synchronized for screen readers.
      HTML attributes require a string, so true/false is converted with String().
    */
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ===== STAGGERED SCROLL-REVEAL DELAYS ===== */
document.querySelectorAll(".scroll-reveal").forEach((element, index) => {
   /*
    Create a CSS variable from 0 through 4.
    style.css multiplies this value by 85ms to stagger animations.
  */
  element.style.setProperty("--reveal-delay", index % 5);
});

/* ===== VIEWPORT OBSERVER ===== */
/*
  IntersectionObserver watches when marked elements enter or leave the screen.
*/
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      /*
        entry.isIntersecting is true when the element is inside the trigger area.
        The second toggle argument adds the class when true and removes it when false.
      */
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    /*
      Start revealing after roughly 18% of an element becomes visible.
    */
    threshold: 0.18,
    /*
      Move the bottom trigger boundary slightly upward for a cleaner entrance.
    */
    rootMargin: "0px 0px -8% 0px",
  }
);

/* Register every scroll-reveal element with the observer. */
document.querySelectorAll(".scroll-reveal").forEach((element) => {
  observer.observe(element);
});

/* ===== INTERNAL PAGE EXIT TRANSITION ===== */
/*
  Only select links that end with .html.
  External LinkedIn, GitHub, X, and Medium links are not included.
*/
document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href);

    /*
      Do not interrupt:
      - links to another website
      - Command-click on macOS
      - Ctrl-click on Windows/Linux
      - Shift-click
    */
    if (url.origin !== window.location.origin || 
        event.metaKey || 
        event.ctrlKey || 
        event.shiftKey
       ) {
      return;
    }

    /* Pause normal navigation so the fade-out can begin. */
    event.preventDefault();
    
    /* style.css uses page-exit to lower opacity. */
    body.classList.add("page-exit");

    /*
      Wait 190 milliseconds, then navigate to the selected page.
      The new page will run this script again and fade in with page-ready.
    */
    window.setTimeout(() => {
      window.location.href = link.href;
    }, 190);
  });
});
