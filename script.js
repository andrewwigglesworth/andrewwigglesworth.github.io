/*
 * Andrew Wigglesworth portfolio interactions — no libraries or build tools.
 * EDIT MAP:
 * 1. PROJECTS below controls the homepage project explorer.
 * 2. ACTIVE_SECTION_OFFSET controls when navigation marks a section active.
 * 3. Theme colors live in style.css, not in this file.
 * Native anchor links and lab-note details still work without JavaScript.
 */

// Locate the mobile menu button by the class used in index.html.
const menuButton = document.querySelector('.menu');
// Locate the navigation element, shared by desktop and mobile layouts.
const navigation = document.querySelector('#navigation');
// Locate the persistent header so section tracking can account for its height.
const header = document.querySelector('.fresh-header');

// Close the small-screen menu and keep the accessibility state in sync.
function closeMenu() {
  // Remove the CSS class that makes the mobile menu visible.
  navigation.classList.remove('open');
  // Tell screen readers that the menu is collapsed.
  menuButton.setAttribute('aria-expanded', 'false');
  // Restore the short button label; EDIT this text to rename the control.
  menuButton.textContent = 'Menu';
}

// Respond when the visitor presses the menu button.
menuButton.addEventListener('click', () => {
  // Toggle the visible state; classList.toggle returns the new state.
  const isOpen = navigation.classList.toggle('open');
  // Expose the same state to assistive technology.
  menuButton.setAttribute('aria-expanded', String(isOpen));
  // EDIT: These two words are the button labels for its open/closed states.
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

// Allow keyboard users to dismiss the mobile navigation with Escape.
document.addEventListener('keydown', (event) => {
  // Only Escape triggers this behavior; other keys retain normal behavior.
  if (event.key === 'Escape') {
    // Collapse the menu using the same helper as section navigation.
    closeMenu();
  }
});

// Find the theme-switch button in the header.
const themeButton = document.querySelector('#theme');
// Store only a theme preference in the visitor's browser, never personal data.
const THEME_STORAGE_KEY = 'portfolio-theme';

// Apply the chosen theme and describe the action available on the button.
function applyTheme(useLightTheme) {
  // body.light activates the light-theme CSS variables in style.css.
  document.body.classList.toggle('light', useLightTheme);
  // EDIT: Rename these labels if desired; they describe the next theme.
  themeButton.querySelector('span').textContent = useLightTheme ? 'Dark mode' : 'Light mode';
}

// Start with dark mode unless the visitor previously saved light mode.
let savedTheme = null;
// Browser privacy settings may prevent localStorage access, so handle failure.
try {
  // Read the saved preference; missing values return null.
  savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
} catch {
  // Keep the default when storage is unavailable; the toggle still works.
  savedTheme = null;
}
// EDIT: Change this condition to savedTheme !== 'dark' to default to light mode.
applyTheme(savedTheme === 'light');

// Switch themes when the visitor activates the control.
themeButton.addEventListener('click', () => {
  // Choose the opposite of the currently active theme.
  const useLightTheme = !document.body.classList.contains('light');
  // Update the page immediately, even if saving the preference fails.
  applyTheme(useLightTheme);
  // Attempt to remember the choice for the next visit.
  try {
    // Save a simple label; no cookies or remote requests are involved.
    localStorage.setItem(THEME_STORAGE_KEY, useLightTheme ? 'light' : 'dark');
  } catch {
    // No recovery is needed: the theme already changed for this visit.
  }
});

// EDIT: Each object describes one project in the homepage explorer.
// Keep the order aligned with the buttons' zero-based data-project values.
const PROJECTS = [
  // First project; data-project="0" selects this object.
  {
    // EDIT: Short decorative initials displayed beside the preview text.
    symbol: 'AD',
    // EDIT: Visible project title; also update its article in index.html.
    title: 'Active Directory Lab',
    // EDIT: One-sentence summary shown when this project is selected.
    description: 'A Windows Server environment with domain-joined workstations.',
    // EDIT: Must match the ID of this project's article in index.html.
    target: '#project-0',
  },
  // Second project; data-project="1" selects this object.
  {
    // EDIT: Short decorative label for this project.
    symbol: '01',
    // EDIT: Display name in the preview.
    title: 'Anime List Tracker',
    // EDIT: Preview description, independent of the longer case-study text.
    description: 'A browser-based tracker for shows you’ve watched and how you rate them.',
    // Keep this fragment synchronized with the matching article ID.
    target: '#project-1',
  },
  // Third project; data-project="2" selects this object.
  {
    // EDIT: Preview initials.
    symbol: 'AW',
    // EDIT: Preview project title.
    title: 'Personal Website',
    // EDIT: Preview summary.
    description: 'A home for technical projects, professional experience, and ongoing learning.',
    // Keep this fragment synchronized with the matching article ID.
    target: '#project-2',
  },
];

// Collect every project-selection button once after the HTML is parsed.
const projectButtons = [...document.querySelectorAll('.pick')];
// Register one click handler for each selection button.
projectButtons.forEach((button) => {
  // This handler also runs when keyboard users activate the native button.
  button.addEventListener('click', () => {
    // Convert the HTML data-project attribute into an array index.
    const project = PROJECTS[Number(button.dataset.project)];
    // Ignore incomplete project configuration instead of breaking the page.
    if (!project) return;
    // Update the selected style and accessible pressed state for every button.
    projectButtons.forEach((candidate) => {
      // Determine whether this is the newly selected button.
      const isSelected = candidate === button;
      // CSS uses active to highlight the current selection.
      candidate.classList.toggle('active', isSelected);
      // Screen readers receive the same selected state.
      candidate.setAttribute('aria-pressed', String(isSelected));
    });
    // Change plain text, not HTML, so project text cannot inject markup.
    document.querySelector('#stage-symbol').textContent = project.symbol;
    // Update the preview's heading.
    document.querySelector('#stage-title').textContent = project.title;
    // Update the preview's short description; its container announces changes politely.
    document.querySelector('#stage-description').textContent = project.description;
    // Send the preview link to the matching article on this same page.
    document.querySelector('#stage-link').setAttribute('href', project.target);
  });
});

// Collect only same-page links from the main navigation.
const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
// Collect the seven major sections in their actual page order.
const sections = [...document.querySelectorAll('.page-section')];
// EDIT: Increase 70 to highlight the next section earlier as you scroll down.
const ACTIVE_SECTION_OFFSET = 70;
// Track whether a scroll update is already scheduled for the next frame.
let updatePending = false;

// Mark the navigation link associated with the section near the header.
function updateActiveSection() {
  // Account for the sticky header's actual height and the adjustable buffer.
  const threshold = header.getBoundingClientRect().bottom + ACTIVE_SECTION_OFFSET;
  // Default to the first section before the visitor scrolls into another one.
  let activeSection = sections[0];
  // Walk through sections in order and remember the last one above the threshold.
  for (const section of sections) {
    // getBoundingClientRect provides a position relative to the current viewport.
    if (section.getBoundingClientRect().top <= threshold) {
      // This section now determines the navigation highlight.
      activeSection = section;
    }
  }
  // Update the accessible current-location state on every navigation link.
  sectionLinks.forEach((link) => {
    // Compare the link fragment with the selected section's ID.
    if (link.hash === `#${activeSection.id}`) {
      // CSS also uses this attribute to style the current section link.
      link.setAttribute('aria-current', 'location');
    } else {
      // Remove stale highlighting from all other sections.
      link.removeAttribute('aria-current');
    }
  });
  // Permit a new scroll update to be scheduled.
  updatePending = false;
}

// Collapse mobile navigation before the browser follows a native anchor link.
sectionLinks.forEach((link) => {
  // Do not preventDefault: native links preserve URL fragments and browser history.
  link.addEventListener('click', closeMenu);
});

// Keep scroll work small by updating at most once per animation frame.
window.addEventListener('scroll', () => {
  // Skip duplicate requests while one update is already pending.
  if (!updatePending) {
    // Mark the request before scheduling it.
    updatePending = true;
    // Run the update just before the next browser repaint.
    requestAnimationFrame(updateActiveSection);
  }
// Passive tells the browser this listener will not prevent scrolling.
}, { passive: true });

// Recalculate after a viewport resize changes line wrapping or header height.
window.addEventListener('resize', updateActiveSection);
// Recalculate after loading, including a bookmarked section URL.
window.addEventListener('load', updateActiveSection);
// Initialize the active link when the deferred script first executes.
updateActiveSection();
