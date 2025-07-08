
// clave usada para guardar la preferencia del usuario en localStorage
const THEME_KEY = 'theme';

// constantes para los temas
const DARK = 'theme-dark';
const LIGHT = 'theme-light';

/**
 * Aplica el tema visual (claro u oscuro) a la página.
 *
 * - Cambia las clases del body según el tema.
 * - Cambia el ícono del botón de tema.
 * - Guarda la preferencia en localStorage.
 *
 * @param {string} theme - 'light' o 'dark'.
 */
function setTheme(theme) {
  //Si el tema es light, se agrega la clase light
  document.body.classList.toggle(LIGHT, theme === 'light');

  //Si el tema es dark, se agrega la clase dark
  document.body.classList.toggle(DARK, theme === 'dark');

  //Cambio de icono dependiendo el tema
  const icon = document.querySelector('#toggle-theme i');
  if (icon) icon.className = theme === 'light' ? 'bi bi-sun' : 'bi bi-moon';

  //Se guarda la preferencia del usuario en localStorage
  localStorage.setItem(THEME_KEY, theme);
}

//Funcion para cambiar el tema
/**
 * Alterna entre tema claro y oscuro.
 *
 * - Detecta el tema actual y aplica el contrario.
 * - Llama a setTheme para actualizar la UI y guardar la preferencia.
 */
function toggleTheme() {
  //Se obtiene el tema actual
  const now = document.body.classList.contains(LIGHT) ? 'light' : 'dark';

  //Se llama a la funcion setTheme para cambiar el tema
  setTheme(now === 'dark' ? 'light' : 'dark');
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  //Busca en el localStorage la preferencia del usuario, sino utiliza dark
  setTheme(localStorage.getItem(THEME_KEY) || 'dark');

  //Se llama a la funcion toggleTheme para cambiar el tema
  const btn = document.getElementById('toggle-theme');
  if (btn) btn.onclick = toggleTheme;
});
