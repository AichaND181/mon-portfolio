/* ============================================
   ARCHICOUD — Main JavaScript
   ============================================ */

// ---- Chemin relatif fiable vers la racine du site ----
// On lit le "src" réel de main.js sur cette page : '' si on est à la racine,
// '../' si on est dans /pages/. Beaucoup plus fiable qu'analyser l'URL,
// qui peut varier selon le serveur local utilisé (Live Server, etc.)
var ARCHICOUD_ROOT = (function () {
    var scriptEl = document.currentScript || document.querySelector('script[src*="main.js"]');
    var src = scriptEl ? scriptEl.getAttribute('src') : 'assets/js/main.js';
    return src.replace('assets/js/main.js', '');
})();

// ---- Garde de session ----
// main.js n'est chargé que sur les pages protégées (jamais sur index.html).
// On vérifie qu'une session existe à chaque affichage de la page, y compris
// quand le navigateur restaure une page depuis son cache (bouton "Retour"
// après une déconnexion) via l'événement pageshow/persisted.
function archicoudCheckSession() {
    if (!localStorage.getItem('archicoud_session')) {
        window.location.replace(ARCHICOUD_ROOT + 'index.html');
    }
}
archicoudCheckSession();
window.addEventListener('pageshow', function (event) {
    if (event.persisted) archicoudCheckSession();
});

// ---- Mobile navbar toggle ----
const navbarToggle = document.getElementById('navbarToggle');
const navbarLinks = document.getElementById('navbarLinks');

if (navbarToggle && navbarLinks) {
    navbarToggle.addEventListener('click', () => {
        navbarLinks.classList.toggle('open');
        var expanded = navbarLinks.classList.contains('open');
        navbarToggle.innerHTML = expanded ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu mobile après avoir cliqué un lien
    navbarLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navbarLinks.classList.remove('open');
            navbarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ---- User dropdown menu ----
const userAvatar = document.querySelector('.navbar-user .avatar');
const userDropdown = document.querySelector('.user-dropdown');

if (userAvatar && userDropdown) {
    userAvatar.addEventListener('click', function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Fermer le menu quand on clique ailleurs
    document.addEventListener('click', function (e) {
        if (!userDropdown.contains(e.target) && !userAvatar.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

// ---- Close mobile navbar on resize to desktop ----
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navbarLinks) {
        navbarLinks.classList.remove('open');
        if (navbarToggle) navbarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// ---- Préférences de notification (utilisées par les pages qui affichent des toasts) ----
window.isNotificationEnabled = function (type) {
    var saved = localStorage.getItem('archicoud_notifications');
    if (!saved) return true; // par défaut activé tant que rien n'a été configuré
    try {
        var notifs = JSON.parse(saved);
        return !!notifs[type];
    } catch (e) {
        return true;
    }
};

// ---- Toast générique (disponible sur toutes les pages) ----
window.showToast = function (message, type) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var icons = { success: 'fas fa-check-circle', error: 'fas fa-circle-exclamation', warning: 'fas fa-triangle-exclamation' };
    var colors = { success: '#15803d', error: '#b91c1c', warning: '#ca8a04' };

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="' + (icons[type] || icons.success) + '" style="color:' + (colors[type] || colors.success) + '"></i> ' + message + '<div class="toast-progress" style="background:' + (colors[type] || colors.success) + '"></div>';
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('toast-out');
        setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
};

// ---- Modal de déconnexion (disponible depuis la navbar, sur toutes les pages) ----
window.openLogoutModal = function () {
    var modal = document.getElementById('logoutModal');
    if (modal) modal.classList.add('visible');
};

window.closeLogoutModal = function () {
    var modal = document.getElementById('logoutModal');
    if (modal) modal.classList.remove('visible');
};

window.confirmLogout = function () {
    localStorage.removeItem('archicoud_session');
    closeLogoutModal();
    window.location.href = ARCHICOUD_ROOT + 'index.html';
};

document.addEventListener('click', function (e) {
    var modal = document.getElementById('logoutModal');
    if (modal && e.target === modal) closeLogoutModal();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLogoutModal();
});

// ---- Animate progress bars on scroll ----
const observerOptions = {
    threshold: 0.3
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.progress-bar-fill');
            bars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width') + '%';
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 200);
            });
            progressObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.volume-grid').forEach(grid => {
    progressObserver.observe(grid);
});

// ---- Animate stat numbers ----
function animateNumber(el, target, duration) {
    duration = duration || 1500;
    var startTime = performance.now();

    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);

        if (target >= 1000) {
            el.textContent = current.toLocaleString('fr-FR').replace(/\s/g, ' ');
        } else {
            el.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

var statValues = document.querySelectorAll('.stat-value');

var statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            var text = entry.target.textContent.trim();
            var num = parseInt(text.replace(/[\s,]/g, ''), 10);
            if (!isNaN(num)) {
                animateNumber(entry.target, num);
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statValues.forEach(function(val) {
    statObserver.observe(val);
});

// ---- Navbar active link highlight ----
var currentPath = window.location.pathname.split('/').pop() || 'index.html';
var navLinksForHighlight = document.querySelectorAll('.navbar-links a');

navLinksForHighlight.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});