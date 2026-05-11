document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;

    try {
        const res = await fetchWithAuth('/api/users/me');
        if (!res) return;
        const user = await res.json();

        document.getElementById('dash-name').textContent = user.name;
        document.getElementById('dash-email').textContent = user.email;
        document.getElementById('dash-phone').textContent = user.phoneNumber || '—';
        document.getElementById('dash-age').textContent = user.age ? `${user.age} años` : '—';
        document.getElementById('dash-address').textContent = user.address || 'No especificada';
        document.getElementById('dash-roles').textContent = user.roles.map(r => r.toUpperCase()).join(', ');
    } catch (err) {
        console.error('Error cargando dashboard:', err);
        M.toast({ html: 'Error al cargar datos', classes: 'red darken-1 rounded' });
    }
});
