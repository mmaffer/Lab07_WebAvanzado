document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;

    try {
        const res = await fetchWithAuth('/api/users/me');
        if (!res) return;
        const user = await res.json();

        // Tarjeta de perfil
        const avatar = user.url_profile || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name + ' ' + user.lastName)}&background=1a237e&color=fff&size=120`;
        document.getElementById('profile-img').src = avatar;
        document.getElementById('profile-fullname').textContent = `${user.name} ${user.lastName}`;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-age').textContent = user.age || '—';
        document.getElementById('profile-since').textContent = formatDate(user.createdAt);

        const rolesDiv = document.getElementById('profile-roles');
        user.roles.forEach(r => {
            const chip = document.createElement('span');
            chip.className = `chip ${r === 'admin' ? 'admin-chip' : 'user-chip'}`;
            chip.textContent = r.toUpperCase();
            rolesDiv.appendChild(chip);
        });

        // Llenar formulario de edición
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            el.value = val || '';
            // Activar label de Materialize
            const label = el.nextElementSibling;
            if (label && label.tagName === 'LABEL' && val) {
                label.classList.add('active');
            }
        };
        setVal('edit-name', user.name);
        setVal('edit-lastName', user.lastName);
        setVal('edit-phone', user.phoneNumber);
        setVal('edit-url', user.url_profile);
        setVal('edit-address', user.address);
        
        // Birthdate
        if (user.birthdate) {
            const bd = new Date(user.birthdate);
            const formatted = bd.toISOString().slice(0, 10);
            setVal('edit-birthdate', formatted);
        }

        // Reiniciar datepicker con valor
        M.updateTextFields();

    } catch (err) {
        console.error('Error cargando perfil:', err);
        M.toast({ html: 'Error al cargar el perfil', classes: 'red darken-1 rounded' });
    }

    // Guardar cambios
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editMsg = document.getElementById('edit-msg');
        editMsg.textContent = '';

        const data = {
            name: document.getElementById('edit-name').value.trim(),
            lastName: document.getElementById('edit-lastName').value.trim(),
            phoneNumber: document.getElementById('edit-phone').value.trim(),
            birthdate: document.getElementById('edit-birthdate').value.trim(),
            url_profile: document.getElementById('edit-url').value.trim(),
            address: document.getElementById('edit-address').value.trim()
        };

        if (!data.name || !data.lastName || !data.phoneNumber || !data.birthdate) {
            editMsg.innerHTML = '<span class="red-text">Completa los campos obligatorios.</span>';
            return;
        }

        const btn = document.getElementById('btn-save');
        btn.disabled = true;

        try {
            const res = await fetchWithAuth('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!res) return;
            const updated = await res.json();

            if (res.ok) {
                M.toast({ html: '¡Perfil actualizado correctamente!', classes: 'green darken-1 rounded' });
                editMsg.innerHTML = '<span class="green-text">Guardado ✓</span>';
                // Actualizar tarjeta
                document.getElementById('profile-fullname').textContent = `${updated.name} ${updated.lastName}`;
                document.getElementById('profile-age').textContent = updated.age || '—';
                if (updated.url_profile) {
                    document.getElementById('profile-img').src = updated.url_profile;
                }
            } else {
                editMsg.innerHTML = `<span class="red-text">${updated.message || 'Error al guardar'}</span>`;
            }
        } catch (err) {
            editMsg.innerHTML = '<span class="red-text">Error de conexión</span>';
        }
        btn.disabled = false;
    });
});
