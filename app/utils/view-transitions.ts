/**
 * Applies a view transition effect to initial page load
 */
export function applyPageLoadTransition() {
  // Check browser support
  if (!document.startViewTransition) {
    return; // Silently exit if browser doesn't support View Transitions
  }

  // Add a class to indicate content is ready to be displayed
  const applyTransition = () => {
    const contentElement = document.querySelector(
      ".body-view-transition"
    ) as HTMLElement | null;
    if (contentElement) {
      // Force a repaint before transition
      contentElement.style.opacity = "0";

      // Start transition
      document.startViewTransition(() => {
        contentElement.style.opacity = "1";
      });
    }
  };

  // Apply after a small delay to ensure DOM is ready
  if (document.readyState === "complete") {
    applyTransition();
  } else {
    window.addEventListener("load", applyTransition);
  }
}
