document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');

    // Manejar el formulario de registro
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            messageElement.textContent = data.message || data.error;
            if (res.ok) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }

    // Manejar el formulario de inicio de sesión
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
                messageElement.textContent = '¡Inicio de sesión exitoso!';
                // Aquí podrías guardar el token (p. ej., en localStorage) y redirigir
            } else {
                messageElement.textContent = data.error;
            }
        });
    }
});