(function () {
    'use strict';

    var AVATAR_COLORS = [
        'var(--blue-500)', 'var(--green-500)', 'var(--orange-500)',
        '#9333ea', 'var(--red-500)', 'var(--gray-500)',
        '#0891b2', '#ca8a04'
    ];

    var deptOptions = [
        'Direction (BAD)', 'Direction', 'Département du Budget',
        'Capital Humain', 'Santé & Action Sociale', 'Passation des Marchés',
        'Services Techniques', 'Cités Universitaires',
        'Département des Moyens Généraux', 'Activités Culturelles et Sportives',
        'Département Informatique', 'Département de l\'Environnement',
        'Restauration Universitaire', 'Unité de Sécurité',
        'Agence Comptable Particulier', 'Cellule de l\'Audit Interne',
        'Cellule Communication', 'Cellule de la Coopération',
        'Cellule Contrôle Interne', 'Cellule Contrôle de Gestion',
        'Cellule Juridique', 'Cellule Suivi'
    ];

    var deptSelect = document.getElementById('editDept');
    if (deptSelect) {
        deptOptions.forEach(function (d) {
            var opt = document.createElement('option');
            opt.value = d; opt.textContent = d;
            deptSelect.appendChild(opt);
        });
    }

    // Charger l'utilisateur
    var editId = parseInt(localStorage.getItem('archicoud_edit_id') || '0', 10);
    var users = JSON.parse(localStorage.getItem('archicoud_users') || '[]');
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === editId) { user = users[i]; break; }
    }

    if (user) {
        document.getElementById('editNom').value = user.nom;
        document.getElementById('editPrenom').value = user.prenom;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editTel').value = user.tel;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editStatut').value = user.statut;
        document.getElementById('editDept').value = user.dept;
    } else {
        document.querySelector('.sc-header h3').innerHTML = '<i class="fas fa-triangle-exclamation" style="color:var(--red-500)"></i> Utilisateur introuvable';
    }

    // Avatar
    var picker = document.getElementById('editAvatarPicker');
    if (picker) {
        AVATAR_COLORS.forEach(function (c) {
            var div = document.createElement('div');
            div.className = 'avatar-choice' + (user && c === user.color ? ' selected' : '');
            div.style.background = c;
            div.setAttribute('data-color', c);
            div.addEventListener('click', function () {
                picker.querySelectorAll('.avatar-choice').forEach(function (el) { el.classList.remove('selected'); });
                div.classList.add('selected');
            });
            picker.appendChild(div);
        });
    }

    // Sauvegarde
    window.saveEditUser = function () {
        if (!user) return;
        clearErrors();
        var valid = true;
        var nom = getVal('editNom');
        var prenom = getVal('editPrenom');
        var email = getVal('editEmail');
        var tel = getVal('editTel');
        var role = getVal('editRole');
        var dept = getVal('editDept');
        var statut = getVal('editStatut');
        var sel = document.querySelector('#editAvatarPicker .avatar-choice.selected');
        var color = sel ? sel.getAttribute('data-color') : user.color;

        if (!nom)    { showErr('editNom', 'Le nom est requis.'); valid = false; }
        if (!prenom) { showErr('editPrenom', 'Le prénom est requis.'); valid = false; }
        if (!email)  { showErr('editEmail', "L'email est requis."); valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('editEmail', "Format d'email invalide."); valid = false; }
        if (!valid) return;

        user.nom = nom.toUpperCase(); user.prenom = prenom; user.email = email;
        user.tel = tel; user.role = role; user.dept = dept; user.statut = statut; user.color = color;

        localStorage.setItem('archicoud_users', JSON.stringify(users));
        // Afficher une notification si l'option est activée
if (isNotificationEnabled('modification')) {
    showToast('✏️ Utilisateur modifié avec succès !', 'success');
}

        var msg = document.getElementById('editSuccessMsg');
        if (msg) msg.classList.add('visible');
        document.querySelector('.form-actions').style.display = 'none';

        setTimeout(function () { window.close(); }, 1500);
    };

    function getVal(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function showErr(id, msg) {
        var el = document.getElementById(id); if (!el) return;
        el.classList.add('input-error');
        var err = el.parentElement.querySelector('.field-error');
        if (err) { err.textContent = msg; err.classList.add('visible'); }
    }
    function clearErrors() {
        document.querySelectorAll('.input-error').forEach(function (el) { el.classList.remove('input-error'); });
        document.querySelectorAll('.field-error').forEach(function (el) { el.classList.remove('visible'); });
    }
})();