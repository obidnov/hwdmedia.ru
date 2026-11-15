(() => {
  'use strict';
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const choices = ['system', 'light', 'dark'];
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')].filter(el => el.tagName === 'BUTTON');
  let preference = choices.includes(root.dataset.themeChoice) ? root.dataset.themeChoice : 'system';
  const setTheme = (choice, save = false) => {
    preference = choices.includes(choice) ? choice : 'system';
    root.dataset.themeChoice = preference;
    root.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === preference)));
    if (save) { try { localStorage.setItem('hwd-theme', preference); } catch {} }
  };
  themeButtons.forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeChoice, true)));
  media.addEventListener('change', () => { if (preference === 'system') setTheme('system'); });
  window.addEventListener('storage', event => { if (event.key === 'hwd-theme' || event.key === null) setTheme(event.newValue); });
  setTheme(preference);

  // Hosted together on Sites; the same build also supports the original domains.
  const host = window.location.hostname.replace(/^www\./, '');
  if (host === 'hwdmedia.ru' || host === 'hwdmedia.com') {
    document.querySelectorAll('[data-language]').forEach(link => {
      link.href = link.dataset.language === 'ru' ? 'https://hwdmedia.ru/' : 'https://hwdmedia.com/';
    });
  }
  const languageMenu = document.querySelector('.language');
  document.addEventListener('click', event => { if (!languageMenu.contains(event.target)) languageMenu.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && languageMenu.open) { languageMenu.open = false; languageMenu.querySelector('summary').focus(); } });

  const dialog = document.querySelector('.photo-dialog');
  const fullImage = dialog.querySelector('.dialog-image');
  const closeButton = dialog.querySelector('.dialog-close');
  let previousFocus;
  document.querySelectorAll('[data-portrait]').forEach(button => button.addEventListener('click', () => {
    previousFocus = button;
    fullImage.src = button.dataset.portrait;
    fullImage.alt = button.dataset.name;
    dialog.querySelector('.dialog-caption').textContent = button.dataset.name;
    dialog.querySelector('.dialog-role').textContent = button.dataset.role;
    dialog.querySelector('.dialog-original').href = button.dataset.portrait;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    closeButton.focus();
  }));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    fullImage.removeAttribute('src');
    previousFocus?.focus();
  });

  const player = document.querySelector('.player');
  const playerTitle = player.dataset.title;
  let hasLoaded = false;
  const onPlayerLoad = () => { hasLoaded = true; player.dataset.playerState = 'loaded'; };
  const watchFrame = () => {
    const frame = player.querySelector('iframe');
    if (frame && !frame.dataset.observed) {
      frame.dataset.observed = 'true';
      frame.title = playerTitle;
      frame.addEventListener('load', onPlayerLoad, { once: true });
      frame.addEventListener('error', () => { player.dataset.playerState = 'error'; }, { once: true });
    }
  };
  new MutationObserver(watchFrame).observe(player, { childList: true, subtree: true });
  watchFrame();
  // Keep the official SDK and localized config; no imitation player or local MP4.
  const addScript = src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('error', () => { player.dataset.playerState = 'error'; });
    document.body.append(script);
  };
  addScript(`https://play.boomstream.net/${player.dataset.videoCode}/config.jsonp`);
  addScript('https://play.boomstream.net/assets/javascripts/biframesdk.js?v=1.5.0');
  setTimeout(() => { if (!hasLoaded) player.dataset.playerState = 'error'; }, 20000);
})();
