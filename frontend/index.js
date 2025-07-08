
  const nameInput = document.getElementById('name');
  const startButton = document.querySelector('.start-button');
  const nameError = document.getElementById('name-error');

function moveToLogin() {
  window.location.href = './pages/admin/login/login.html';
}

function handleStart() {
  if (isValidName(nameInput.value)) {
    localStorage.setItem('userName', nameInput.value);
    nameInput.value = '';
    startButton.setAttribute('disabled', 'disabled');
    window.location.href = './pages/client/list/list.html';
  }
}

function isValidName(name) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(name);
}

window.addEventListener('DOMContentLoaded', () => {
  const adminAccess = document.querySelector('.admin-access');

  // Mostrar/Ocultar boton admin-access con atajos
  window.addEventListener('keydown', (e) => {
    // Mostrar con A
    if ( e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      adminAccess.classList.remove('d-none');
    }
    // Ocultar con Q
    if ( e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      adminAccess.classList.add('d-none');
    }
  });

  nameInput.addEventListener('input', () => {
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

  nameInput.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter' && isValidName(nameInput.value)) {
      handleStart();
    }
  });

  startButton.addEventListener('click', handleStart);
});
