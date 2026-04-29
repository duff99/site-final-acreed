/**
 * Visually-hidden link that becomes the first focusable element on every
 * page. Lets keyboard users jump past the navigation straight to the page's
 * main content. The target is `#main-content`, which must exist on the
 * page (we tag the relevant <main> or section with that id and tabIndex=-1
 * so focus actually lands inside).
 */
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-medium focus:shadow-lg"
  >
    Aller au contenu principal
  </a>
);

export default SkipToContent;
