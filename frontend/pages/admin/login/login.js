
function moveToWelcome() {
    window.location.href = '../../../index.html';
}

/**
 * Maneja el inicio de sesión del administrador.
 * Obtiene el email y la contraseña de los campos de entrada, valida que no estén vacíos,
 * y realiza una solicitud POST al servidor para autenticar al usuario.
 * Si la autenticación es exitosa, guarda el token y los datos del usuario en sessionStorage
 * y redirige al usuario al panel de administración.
 * Si hay un error, muestra un mensaje de error en la página.   
 */

const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    if(errorDiv) errorDiv.innerHTML = '';

    if (!email || !pass) {
        errorDiv.innerHTML = `<div class='alert alert-danger mt-3' role='alert'>Por favor, ingresa email y contraseña</div>`;
        return;
    }

    try {
        const url = "http://localhost:3000/api/auth/login"
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: pass
            })
        })

        const data = await res.json();

        if(res.status === 200 && data.token){
            // Guardar token y datos del usuario en sessionStorage
            saveAuthData(data.token, data.user);
            
            window.location.href = '../../../pages/admin/dashboard/dashboard.html';
        } else {
            errorDiv.innerHTML = `<div class='alert alert-danger mt-3' role='alert'>Usuario o contraseña incorrectos</div>`;
        }
    } catch (error) {
        console.error('Error en el login:', error);
        errorDiv.innerHTML = `<div class='alert alert-danger mt-3' role='alert'>Error de conexión. Verifica que el servidor esté ejecutándose.</div>`;
    }
}

/**
 * Rellena los campos de email y contraseña con datos de un administrador de demostración.
 */

const fillDemoAdmin = () => {
    document.getElementById('email').value = 'profesor@example.com';
    document.getElementById('password').value = 'admin123';
}

/**
 * Rellena los campos de email y contraseña con datos de un super administrador de demostración.
 */
const fillDemoSuperAdmin = () => {
    document.getElementById('email').value = 'superadmin@example.com';
    document.getElementById('password').value = 'superadmin123';
}

