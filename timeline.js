// ISO dates sort correctly as strings. New entries may be added anywhere in the list.
const timeline = document.querySelector('.timeline');
if (timeline) {
  [...timeline.children]
    .sort((a, b) => b.dataset.date.localeCompare(a.dataset.date))
    .forEach(entry => timeline.appendChild(entry));
}
const timelineMenu = document.querySelector('.nav-toggle');
if (timelineMenu) {
  timelineMenu.addEventListener('click', () => {
    timelineMenu.setAttribute('aria-label', timelineMenu.getAttribute('aria-expanded') === 'true' ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && timelineMenu.getAttribute('aria-expanded') === 'true') {
      timelineMenu.click();
      timelineMenu.focus();
    }
  });
}
