(function () {
    'use strict';

    var defaultUsers = [
        { id: 1, nom: 'NIANG',        prenom: 'Coumba Dia',     email: 'coumba.niang@coud.sn',   tel: '+221 77 123 45 67', role: 'admin',  dept: 'Direction (BAD)',           statut: 'actif',  color: 'var(--blue-500)',   derniere: '15 Jan 2025, 09:32' },
        { id: 2, nom: 'DIALLO',       prenom: 'Abdoulaye',       email: 'abdoulaye.diallo@coud.sn',tel: '+221 78 234 56 78', role: 'agent',  dept: 'Département du Budget',    statut: 'actif',  color: 'var(--green-500)',  derniere: '14 Jan 2025, 16:45' },
        { id: 3, nom: 'SOW',          prenom: 'Fatou',           email: 'fatou.sow@coud.sn',      tel: '+221 76 345 67 89', role: 'agent',  dept: 'Capital Humain',            statut: 'actif',  color: 'var(--orange-500)', derniere: '14 Jan 2025, 11:20' },
        { id: 4, nom: 'BA',           prenom: 'Moussa',          email: 'moussa.ba@coud.sn',      tel: '+221 77 456 78 90', role: 'lecture', dept: 'Santé & Action Sociale',   statut: 'actif',  color: '#9333ea',            derniere: '10 Jan 2025, 08:15' },
        { id: 5, nom: 'FALL',         prenom: 'Ndeye Khady',     email: 'ndeye.fall@coud.sn',     tel: '+221 78 567 89 01', role: 'agent',  dept: 'Passation des Marchés',    statut: 'actif',  color: 'var(--red-500)',    derniere: '09 Jan 2025, 14:50' },
        { id: 6, nom: 'DIOP',         prenom: 'Seydou',          email: 'seydou.diop@coud.sn',    tel: '+221 76 678 90 12', role: 'lecture', dept: 'Services Techniques',       statut: 'inactif', color: 'var(--gray-400)',   derniere: '03 Jan 2025, 10:00' },
        { id: 7, nom: 'THIAM',        prenom: 'Aminata',         email: 'aminata.thiam@coud.sn',  tel: '+221 77 789 01 23', role: 'lecture', dept: 'Cités Universitaires',      statut: 'inactif', color: '#089b2',            derniere: '28 Déc 2024, 09:30' },
        { id: 8, nom: 'LY',           prenom: 'Ibrahima',        email: 'ibrahima.ly@coud.sn',    tel: '+221 78 890 12 34', role: 'admin',  dept: 'Direction',                statut: 'actif',  color: '#ca8a04',            derniere: '15 Jan 2025, 07:55' }
    ];

    if (!localStorage.getItem('archicoud_users')) {
        localStorage.setItem('archicoud_users', JSON.stringify(defaultUsers));
        localStorage.setItem('archicoud_nextId', '9');
    }

    function getUsers() {
        try { return JSON.parse(localStorage.getItem('archicoud_users')) || defaultUsers; }
        catch (e) { return defaultUsers; }
    }

    function saveUsers(data) {
        localStorage.setItem('archicoud_users', JSON.stringify(data));
    }

    var searchInput    = document.getElementById('userSearch');
    var roleFilter     = document.getElementById('userRoleFilter');
    var statutFilter   = document.getElementById('userStatutFilter');
    var deptFilter     = document.getElementById('userDeptFilter');
    var tableBody      = document.getElementById('usersTableBody');
    var userCount      = document.getElementById('userCount');
    var paginationInfo = document.getElementById('paginationInfo');

    var roleLabels = {
        admin:   'Administrateur',
        agent:   'Agent',
        lecture: 'Lecture seule',
        archiviste: 'Archiviste'
    };

    function applyFilters() {
        var query   = searchInput  ? searchInput.value.toLowerCase().trim() : '';
        var roleVal = roleFilter   ? roleFilter.value   : '';
        var statutVal = statutFilter ? statutFilter.value : '';
        var deptVal = deptFilter   ? deptFilter.value   : '';

        var users = getUsers();
        var filtered = users.filter(function (u) {
            var text = (u.nom + ' ' + u.prenom + ' ' + u.email + ' ' + u.dept).toLowerCase();
            var matchSearch  = !query || text.indexOf(query) !== -1;
            var matchRole    = !roleVal || u.role === roleVal;
            var matchStatut  = !statutVal || u.statut === statutVal;
            var matchDept    = !deptVal || u.dept === deptVal;
            return matchSearch && matchRole && matchStatut && matchDept;
        });
         // TRIER (du plus récent au plus ancien)
    filtered.sort(function(a, b) { return b.id - a.id; });

    renderTableFromData(filtered);

        renderTableFromData(filtered);
        if (userCount)      userCount.textContent = filtered.length + ' utilisateur' + (filtered.length > 1 ? 's' : '');
        if (paginationInfo)  paginationInfo.textContent = 'Affichage 1 - ' + filtered.length + ' sur ' + filtered.length + ' utilisateur' + (filtered.length > 1 ? 's' : '');
    }

    function renderTableFromData(data) {
        if (!tableBody) return;
        var html = '';
        data.forEach(function (u) {
            var initials = u.prenom.charAt(0) + u.nom.charAt(0);
            var roleLabel  = roleLabels[u.role] || u.role;
            var statusLabel = u.statut === 'actif' ? 'Actif' : 'Inactif';

            html += '<tr>' +
                '<td><div class="user-cell"><div class="user-avatar" style="background:' + u.color + '">' + initials + '</div><div class="user-cell-info"><h5>' + u.prenom + ' ' + u.nom + '</h5><span>' + u.email + '</span></div></div></td>' +
                '<td><span class="role-badge ' + u.role + '">' + roleLabel + '</span></td>' +
                '<td>' + u.dept + '</td>' +
                '<td>' + u.derniere + '</td>' +
                '<td><span class="status-dot ' + u.statut + '">' + statusLabel + '</span></td>' +
                '<td><div class="action-btns">' +
                    '<button title="Voir les détails" onclick="openDetailTab(' + u.id + ')"><i class="fas fa-eye"></i></button>' +
                    '<button title="Modifier" onclick="openEditTab(' + u.id + ')"><i class="fas fa-pen"></i></button>' +
                   '<button title="Supprimer" onclick="openDeleteModal(' + u.id + ')"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        });
        tableBody.innerHTML = html;
    }

    // ---- Ouvrir dans un nouvel onglet ----
    window.openAddTab    = function () { window.open('user-add.html', '_blank'); };
    window.openDetailTab = function (id) {
        localStorage.setItem('archicoud_detail_id', String(id));
        window.open('user-detail.html', '_blank');
    };
    window.openEditTab    = function (id) { localStorage.setItem('archicoud_edit_id', String(id)); window.open('user-edit.html', '_blank'); };
   

    // ---- Modal de suppression (dans la page) ----
    var currentDeleteId = null;

    window.openDeleteModal = function (id) {
        var users = getUsers();
        var user = null;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === id) { user = users[i]; break; }
        }
        if (!user) return;

        currentDeleteId = id;
        var initials = user.prenom.charAt(0) + user.nom.charAt(0);
        var avatarEl = document.getElementById('deleteModalAvatar');
        if (avatarEl) { avatarEl.style.background = user.color; avatarEl.textContent = initials; }
        var nameEl = document.getElementById('deleteModalUserName');
        if (nameEl) nameEl.textContent = user.prenom + ' ' + user.nom;

        var modal = document.getElementById('deleteModal');
        if (modal) modal.classList.add('visible');
    };

    window.closeDeleteModal = function () {
        var modal = document.getElementById('deleteModal');
        if (modal) modal.classList.remove('visible');
        currentDeleteId = null;
    };

    window.confirmDeleteUser = function () {
        if (currentDeleteId === null) return;

        var users = getUsers().filter(function (u) { return u.id !== currentDeleteId; });
        saveUsers(users);
        closeDeleteModal();
        applyFilters();

        var notifs = JSON.parse(localStorage.getItem('archicoud_notifications') || '{}');
        if (notifs.suppression !== false) {
            showToast('🗑️ Utilisateur supprimé avec succès !', 'warning');
        }
    };

    document.addEventListener('click', function (e) {
        var modal = document.getElementById('deleteModal');
        if (modal && e.target === modal) closeDeleteModal();
    });

    // ---- Écouteurs ----
    if (searchInput)  searchInput.addEventListener('input', applyFilters);
    if (roleFilter)   roleFilter.addEventListener('change', applyFilters);
    if (statutFilter) statutFilter.addEventListener('change', applyFilters);
    if (deptFilter)   deptFilter.addEventListener('change', applyFilters);

    // ---- Rafraîchir quand l'onglet reprend le focus ----
    window.addEventListener('focus', function () { applyFilters(); });
    applyFilters();
    
    // ============================================
// BOUTONS FILTRER / RÉINITIALISER
// ============================================
var filterBtn = document.getElementById('filterBtn');
var resetBtn = document.getElementById('resetBtn');

if (filterBtn) {
    filterBtn.addEventListener('click', applyFilters);
}

if (resetBtn) {
    resetBtn.addEventListener('click', function () {
        // Remettre tous les champs à vide
        if (searchInput) searchInput.value = '';
        if (roleFilter) roleFilter.value = '';
        if (statutFilter) statutFilter.value = '';
        if (deptFilter) deptFilter.value = '';
        // Appliquer le filtrage (qui va tout réafficher)
        applyFilters();
    });
}

// Le rafraîchissement automatique au retour sur l'onglet
window.addEventListener('focus', function () {
    applyFilters();
});
})();