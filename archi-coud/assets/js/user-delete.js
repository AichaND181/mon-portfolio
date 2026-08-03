(function () {
    'use strict';

    var deleteId = parseInt(localStorage.getItem('archicoud_delete_id') || '0', 10);
    var users = JSON.parse(localStorage.getItem('archicoud_users') || '[]');
    var user = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].id === deleteId) { user = users[i]; break; }
    }

    if (user) {
        var initials = user.prenom.charAt(0) + user.nom.charAt(0);
        var avatarEl = document.getElementById('deleteAvatar');
        if (avatarEl) { avatarEl.style.background = user.color; avatarEl.textContent = initials; }
        var nameEl = document.getElementById('deleteUserName');
        if (nameEl) nameEl.textContent = user.prenom + ' ' + user.nom;
        var emailEl = document.getElementById('deleteUserEmail');
        if (emailEl) emailEl.textContent = user.email;
    } else {
        document.querySelector('.sc-header h3').innerHTML = '<i class="fas fa-triangle-exclamation" style="color:var(--red-500)"></i> Utilisateur introuvable';
    }

    window.confirmDeleteUser = function () {
        if (!user) return;

        users = users.filter(function (u) { return u.id !== deleteId; });
        localStorage.setItem('archicoud_users', JSON.stringify(users));

        var msg = document.getElementById('deleteSuccessMsg');
        if (msg) msg.classList.add('visible');
        document.querySelector('.delete-actions').style.display = 'none';

        setTimeout(function () { window.close(); }, 1500);

        var notifs = JSON.parse(localStorage.getItem('archicoud_notifications') || '{}');
if (notifs.suppression !== false) {
    showToast('🗑️ Utilisateur supprimé avec succès !', 'warning');
}
    };
})();