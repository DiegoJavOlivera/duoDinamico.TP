window.addEventListener('DOMContentLoaded', function() {
  const nameInput = document.getElementById('name');
  const startButton = document.querySelector('.start-button');

  function isValidName(name) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/.test(name);
  }

  nameInput.addEventListener('input', function() {
    if (isValidName(nameInput.value)) {
      startButton.removeAttribute('disabled');
    } else {
      startButton.setAttribute('disabled', 'disabled');
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
