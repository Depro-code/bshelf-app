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

  const deepLink = `com.bshelf://book/${bookId}`;
  openApp.setAttribute('href', deepLink);
  openApp.setAttribute('aria-disabled', 'false');
  status.textContent = `Ready to open book ${bookId} in the app.`;
})();
