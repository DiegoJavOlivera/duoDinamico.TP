
window.addEventListener('DOMContentLoaded', function() {
  const adminAccess = document.querySelector('.admin-access');


  // Mostrar/Ocultar admin-access con atajos
  window.addEventListener('keydown', function(e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    // Mostrar con A
    if (
      (isMac && e.metaKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
      (!isMac && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')
    ) {
      adminAccess.classList.remove('d-none');
    }
    // Ocultar con Q
    if (
      (isMac && e.metaKey && e.shiftKey && e.key.toLowerCase() === 'z') ||
      (!isMac && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')
    ) {
      adminAccess.classList.add('d-none');
    }
  });

  const nameInput = document.getElementById('name');
  const startButton = document.querySelector('.start-button');

  // Permite que toggleTheme.js pueda actualizar el logo tras cambiar el tema

  const nameError = document.getElementById('name-error');

  function isValidName(name) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(name);
  }

  nameInput.addEventListener('input', function() {
    if (nameInput.value === '') {
      nameInput.classList.remove('is-invalid');
      nameError.style.display = 'none';
      startButton.setAttribute('disabled', 'disabled');
    } else if (isValidName(nameInput.value)) {
      startButton.removeAttribute('disabled');
      nameInput.classList.remove('is-invalid');
      nameError.style.display = 'none';
    } else {
      startButton.setAttribute('disabled', 'disabled');
      nameInput.classList.add('is-invalid');
      nameError.textContent = 'Solo se admiten letras';
      nameError.style.display = 'block';
    }
  });

  nameInput.addEventListener('keyup', function(evt) {
    if (evt.key === 'Enter' && isValidName(nameInput.value)) {
      localStorage.setItem('userName', nameInput.value);
      nameInput.value = '';
      startButton.setAttribute('disabled', 'disabled');
      moveToDashboard();
    }
  });

  startButton.addEventListener('click', function() {
    if (isValidName(nameInput.value)) {
      localStorage.setItem('userName', nameInput.value);
      nameInput.value = '';
      startButton.setAttribute('disabled', 'disabled');
    }
  });
});
