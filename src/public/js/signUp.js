document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signUpForm');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.textContent = '';

        const name = document.getElementById('name').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const birthdate = document.getElementById('birthdate').value.trim();
        const password = document.getElementById('password').value;

        // Validaciones client-side
        if (!name || !lastName || !email || !phoneNumber || !birthdate || !password) {
            errorMsg.textContent = 'Completa todos los campos obligatorios.';
            return;
        }

        // Validar password
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;
        if (!passRegex.test(password)) {
            errorMsg.textContent = 'La contraseña debe tener mín. 8 caracteres, 1 mayúscula, 1 dígito y 1 especial (#$%&*@).';
            return;
        }

        const btn = document.getElementById('btn-signup');
        btn.disabled = true;
        btn.innerHTML = '<i class="material-icons left">hourglass_empty</i> Registrando...';

        try {
            const res = await fetch('/api/auth/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, lastName, email, phoneNumber, birthdate, password })
            });
            const data = await res.json();

            if (!res.ok) {
                errorMsg.textContent = data.message || 'Error al registrarse';
                btn.disabled = false;
                btn.innerHTML = 'Registrarse <i class="material-icons right">how_to_reg</i>';
                return;
            }

            // Éxito — mostrar toast y redirigir
            M.toast({ html: '¡Registro exitoso! Redirigiendo a login...', classes: 'green darken-1 rounded' });
            setTimeout(() => {
                window.location.href = '/signIn';
            }, 1500);
        } catch (err) {
            errorMsg.textContent = 'Error de conexión con el servidor.';
            btn.disabled = false;
            btn.innerHTML = 'Registrarse <i class="material-icons right">how_to_reg</i>';
        }
    });
});
