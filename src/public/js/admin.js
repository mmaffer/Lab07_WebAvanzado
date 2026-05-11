document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;
    if (!checkRole('admin')) return;

    try {
        const res = await fetchWithAuth('/api/users');
        if (!res) return;
        const users = await res.json();

        document.getElementById('stat-total').textContent = users.length;
        const adminCount = users.filter(u => u.roles.includes('admin')).length;
        document.getElementById('stat-admins').textContent = adminCount;
        document.getElementById('stat-users').textContent = users.length - adminCount;

        const tbody = document.getElementById('users-tbody');
        users.forEach((u, i) => {
            const rolesBadges = u.roles.map(r => 
                '<span class="chip ' + (r === 'admin' ? 'admin-chip' : 'user-chip') + '">' + r + '</span>'
            ).join(' ');
            const tr = document.createElement('tr');
            tr.innerHTML = '<td>' + (i+1) + '</td><td>' + u.name + ' ' + (u.lastName||'') + '</td><td>' + u.email + '</td><td>' + (u.phoneNumber||'—') + '</td><td>' + rolesBadges + '</td><td>' + formatDate(u.createdAt) + '</td><td><button class="btn-small waves-effect waves-light btn-view-user btn-gradient" data-index="' + i + '"><i class="material-icons">visibility</i></button></td>';
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-view-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const u = users[parseInt(btn.dataset.index)];
                const avatar = u.url_profile || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.name + ' ' + (u.lastName||'')) + '&background=1a237e&color=fff&size=120';
                const rolesBadges2 = u.roles.map(r => '<span class="chip ' + (r === 'admin' ? 'admin-chip' : 'user-chip') + '">' + r.toUpperCase() + '</span>').join(' ');
                const birthF = u.birthdate ? new Date(u.birthdate).toLocaleDateString('es-PE') : '—';
                document.getElementById('modal-body').innerHTML = '<div class="col s12 center-align" style="margin-bottom:16px"><img src="' + avatar + '" class="circle" style="width:100px;height:100px;object-fit:cover"></div><div class="col s12 m6"><p><strong>Nombre:</strong> ' + u.name + '</p><p><strong>Apellido:</strong> ' + (u.lastName||'—') + '</p><p><strong>Email:</strong> ' + u.email + '</p><p><strong>Teléfono:</strong> ' + (u.phoneNumber||'—') + '</p></div><div class="col s12 m6"><p><strong>Nacimiento:</strong> ' + birthF + '</p><p><strong>Edad:</strong> ' + (u.age||'—') + ' años</p><p><strong>Dirección:</strong> ' + (u.address||'—') + '</p><p><strong>Roles:</strong> ' + rolesBadges2 + '</p><p><strong>Registrado:</strong> ' + formatDate(u.createdAt) + '</p></div>';
                M.Modal.getInstance(document.getElementById('user-detail-modal')).open();
            });
        });
    } catch (err) {
        console.error('Error:', err);
        M.toast({ html: 'Error al cargar usuarios', classes: 'red darken-1 rounded' });
    }
});
