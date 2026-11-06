(() => {
  let choice = 'system';
  try { choice = localStorage.getItem('hwd-theme') || 'system'; } catch {}
  if (!['system', 'light', 'dark'].includes(choice)) choice = 'system';
  document.documentElement.dataset.themeChoice = choice;
  document.documentElement.dataset.theme = choice === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : choice;
})();
