// toggleTheme.js SIMPLE
const THEME_KEY = 'theme';
const DARK = 'theme-dark';
const LIGHT = 'theme-light';

function setTheme(theme) {
  document.body.classList.toggle(LIGHT, theme === 'light');
  document.body.classList.toggle(DARK, theme === 'dark');
  const icon = document.querySelector('#toggle-theme i');
  if (icon) icon.className = theme === 'light' ? 'bi bi-sun' : 'bi bi-moon';
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const now = document.body.classList.contains(LIGHT) ? 'light' : 'dark';
  setTheme(now === 'dark' ? 'light' : 'dark');
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem(THEME_KEY) || 'dark');
    const btn = document.getElementById('toggle-theme');
  if (btn) btn.onclick = toggleTheme;
  });
