// Paste this into the browser console after choosing a viewport in DevTools.
// Repeat with different widths and menu filters.
(() => {
  const viewportWidth = document.documentElement.clientWidth;
  const pageWidth = document.documentElement.scrollWidth;
  const overflowingElements = [...document.querySelectorAll('body *')].filter((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.right > viewportWidth + 1 || bounds.left < -1;
  });

  const passed = pageWidth <= viewportWidth && overflowingElements.length === 0;
  console.log(passed ? 'PASS: no horizontal scroll' : 'FAIL: horizontal overflow', {
    viewportWidth,
    pageWidth,
    overflowingElements,
  });
  return passed;
})();
