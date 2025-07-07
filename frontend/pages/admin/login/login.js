function moveToWelcome() {
    window.location.href = '../../../index.html';
}

const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    if (!email || !pass) {
        alert('Por favor, ingresa email y contraseña');
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
            alert('Error: Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        alert('Error de conexión. Verifica que el servidor esté ejecutándose.');
    }
}

const fillDemo = () => {
    document.getElementById('email').value = 'profesor@example.com';
    document.getElementById('password').value = 'admin123';
}
