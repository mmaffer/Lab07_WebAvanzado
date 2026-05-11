document.addEventListener('DOMContentLoaded', () => {
    // Si ya tiene token válido, redirigir al dashboard
    const token = getToken();
    if (token && !isTokenExpired(token)) {
        const roles = getRoles();
        if (roles.includes('admin')) {
            window.location.href = '/admin';
        } else {
            window.location.href = '/dashboard';
        }
        return;
    }

    const form = document.getElementById('signInForm');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            errorMsg.textContent = 'Completa todos los campos.';
            return;
        }

        const btn = document.getElementById('btn-signin');
        btn.disabled = true;
        btn.innerHTML = '<i class="material-icons left">hourglass_empty</i> Ingresando...';

        try {
            const res = await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                errorMsg.textContent = data.message || 'Error al iniciar sesión';
                btn.disabled = false;
                btn.innerHTML = 'Ingresar <i class="material-icons right">send</i>';
                return;
            }

            saveToken(data.token);

            // Redirigir según rol
            const roles = getRoles();
            if (roles.includes('admin')) {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            errorMsg.textContent = 'Error de conexión con el servidor.';
            btn.disabled = false;
            btn.innerHTML = 'Ingresar <i class="material-icons right">send</i>';
        }
    });
});
