window.addEventListener('DOMContentLoaded', function() {
  const nameInput = document.getElementById('name');
  const startButton = document.querySelector('.start-button');
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
