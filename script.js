(function () {
  const openApp = document.getElementById('openApp');
  const status = document.getElementById('status');

  function getBookIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('book') || params.get('bookId');
    if (fromQuery) return fromQuery;
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0]) return parts[0];
    return '';
  }

  const bookId = getBookIdFromUrl();
  if (!bookId) {
    openApp.setAttribute('href', '#');
    openApp.setAttribute('aria-disabled', 'true');
    status.textContent = 'Missing book ID in the link.';
    return;
  }

  const encodedBookId = encodeURIComponent(bookId);
  const universalLink = `${window.location.origin}/${encodedBookId}`;
  const customSchemeLink = `bshelf://book/${encodedBookId}`;
  const androidIntentLink = `intent://${window.location.host}/${encodedBookId}#Intent;scheme=https;package=com.uniforge.BookShelf;S.browser_fallback_url=${encodeURIComponent(universalLink)};end`;

  function getLaunchLink() {
    return /android/i.test(navigator.userAgent)
      ? androidIntentLink
      : customSchemeLink;
  }

  const launchLink = getLaunchLink();
  openApp.setAttribute('href', launchLink);
  openApp.setAttribute('aria-disabled', 'false');
  status.textContent = `Trying to open book ${bookId} in the app...`;

  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const launchKey = `bshelf-launch-attempted-${bookId}`;

  if (!isMobile || sessionStorage.getItem(launchKey) === '1') {
    status.textContent = `Ready to open book ${bookId} in the app.`;
    return;
  }

  sessionStorage.setItem(launchKey, '1');

  let appOpened = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) appOpened = true;
  });

  setTimeout(function () {
    if (!appOpened) {
      status.textContent = 'Could not launch app automatically. Tap "Open this book in the app".';
    }
  }, 1800);

  window.location.href = launchLink;
})();
