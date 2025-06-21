const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

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

    if(res.status === 200){
      alert('Acceso concedido: Bienvenido al panel de administración');
      moveToAdminDashboard();
    } else {
        alert('Error: Usuario o contraseña incorrectos');
    }
}

const fillDemo = () => {
    document.getElementById('email').value = 'profesor@example.com';
    document.getElementById('password').value = 'admin123';
}
