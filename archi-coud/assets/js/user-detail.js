(function () {
    'use strict';

    var roleLabels = {
        admin:   'Administrateur',
        agent:   'Agent',
        lecture: 'Lecture seule'
    };

    function getUsers() {
        try { return JSON.parse(localStorage.getItem('archicoud_users')) || []; }
        catch (e) { return []; }
    }

    function getUserById(id) {
        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            if (String(users[i].id) === String(id)) return users[i];
        }
        return null;
    }

    var detailState   = document.getElementById('detailState');
    var notFoundState = document.getElementById('notFoundState');

    function showNotFound() {
        if (detailState) detailState.style.display = 'none';
        if (notFoundState) notFoundState.style.display = 'block';
    }

    function render(user) {
        var initials = user.prenom.charAt(0) + user.nom.charAt(0);
        var roleLabel = roleLabels[user.role] || user.role;
        var statusLabel = user.statut === 'actif' ? 'Actif' : 'Inactif';

        var avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.textContent = initials;
            avatar.style.background = user.color || 'var(--blue-500)';
        }

        setText('profileName', user.prenom + ' ' + user.nom);
        setText('profileEmail', user.email);

        var roleBadge = document.getElementById('profileRoleBadge');
        if (roleBadge) {
            roleBadge.textContent = roleLabel;
            roleBadge.className = 'role-badge ' + user.role;
        }

        var statusDot = document.getElementById('profileStatusDot');
        if (statusDot) {
            statusDot.textContent = statusLabel;
            statusDot.className = 'status-dot ' + user.statut;
        }

        setText('infoEmail', user.email);
        setText('infoTel', user.tel || '—');
        setText('infoRole', roleLabel);
        setText('infoDept', user.dept);
        setText('infoStatut', statusLabel);
        setText('infoDerniere', user.derniere || '—');

        var editBtn = document.getElementById('editBtn');
        if (editBtn) {
            editBtn.addEventListener('click', function () {
                localStorage.setItem('archicoud_edit_id', String(user.id));
                window.open('user-edit.html', '_blank');
            });
        }

        var deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function () {
                localStorage.setItem('archicoud_delete_id', String(user.id));
                window.open('user-delete.html', '_blank');
            });
        }
    }

    function setText(id, value) {
        var el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function init() {
        var id = localStorage.getItem('archicoud_detail_id');
        var user = id ? getUserById(id) : null;
        if (!user) {
            showNotFound();
            return;
        }
        render(user);
    }

    init();

    // Rafraîchit si l'onglet reprend le focus (ex: après modification)
    window.addEventListener('focus', function () {
        var id = localStorage.getItem('archicoud_detail_id');
        var user = id ? getUserById(id) : null;
        if (user) render(user);
    });
})();