/* ===== auth.js — Utilidades de autenticación client-side ===== */

function getToken() {
    return sessionStorage.getItem('jwt_token');
}

function saveToken(token) {
    sessionStorage.setItem('jwt_token', token);
}

function logout() {
    sessionStorage.removeItem('jwt_token');
    window.location.href = '/signIn';
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

function getRoles() {
    const token = getToken();
    if (!token) return [];
    const payload = parseJwt(token);
    return payload ? (payload.roles || []) : [];
}

function checkAuth() {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        logout();
        return false;
    }
    return true;
}

function checkRole(role) {
    const roles = getRoles();
    if (!roles.includes(role)) {
        window.location.href = '/403';
        return false;
    }
    return true;
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
        logout();
        return;
    }
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        logout();
        return;
    }
    if (response.status === 403) {
        window.location.href = '/403';
        return;
    }
    return response;
}

function updateNavbar() {
    const token = getToken();
    const navLinks = document.getElementById('nav-links');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!navLinks) return;

    let links = '';
    let mobileLinks = '';

    if (token && !isTokenExpired(token)) {
        const roles = getRoles();
        const isAdmin = roles.includes('admin');

        links += '<li><a href="/dashboard"><i class="material-icons left">dashboard</i>Dashboard</a></li>';
        mobileLinks += '<li><a href="/dashboard"><i class="material-icons">dashboard</i>Dashboard</a></li>';
        
        if (isAdmin) {
            links += '<li><a href="/admin"><i class="material-icons left">admin_panel_settings</i>Admin</a></li>';
            mobileLinks += '<li><a href="/admin"><i class="material-icons">admin_panel_settings</i>Admin</a></li>';
        }

        links += '<li><a href="/profile"><i class="material-icons left">account_circle</i>Perfil</a></li>';
        mobileLinks += '<li><a href="/profile"><i class="material-icons">account_circle</i>Perfil</a></li>';
        
        links += '<li><a href="#" onclick="logout()"><i class="material-icons left">exit_to_app</i>Salir</a></li>';
        mobileLinks += '<li><a href="#" onclick="logout()"><i class="material-icons">exit_to_app</i>Salir</a></li>';
    } else {
        links += '<li><a href="/signIn"><i class="material-icons left">login</i>Ingresar</a></li>';
        mobileLinks += '<li><a href="/signIn"><i class="material-icons">login</i>Ingresar</a></li>';
        
        links += '<li><a href="/signUp"><i class="material-icons left">person_add</i>Registrarse</a></li>';
        mobileLinks += '<li><a href="/signUp"><i class="material-icons">person_add</i>Registrarse</a></li>';
    }

    navLinks.innerHTML = links;
    if (mobileNav) mobileNav.innerHTML = mobileLinks;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
}
