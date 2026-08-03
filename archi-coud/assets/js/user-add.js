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

    // Remplir le select département
    var deptSelect = document.getElementById('addDept');
    if (deptSelect) {
        deptOptions.forEach(function (d) {
            var opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            deptSelect.appendChild(opt);
        });
    }

    // Avatar choices
    var picker = document.getElementById('addAvatarPicker');
    if (picker) {
        AVATAR_COLORS.forEach(function (c) {
            var div = document.createElement('div');
            div.className = 'avatar-choice' + (c === AVATAR_COLORS[0] ? ' selected' : '');
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
    window.saveNewUser = function () {
        clearErrors();
        var valid = true;
        var nom = getVal('addNom');
        var prenom = getVal('addPrenom');
        var email = getVal('addEmail');
        var tel = getVal('addTel');
        var role = getVal('addRole');
        var dept = getVal('addDept');
        var statut = getVal('addStatut');

        var sel = document.querySelector('#addAvatarPicker .avatar-choice.selected');
        var color = sel ? sel.getAttribute('data-color') : AVATAR_COLORS[0];

        if (!nom)    { showErr('addNom', 'Le nom est requis.'); valid = false; }
        if (!prenom) { showErr('addPrenom', 'Le prénom est requis.'); valid = false; }
        if (!email)  { showErr('addEmail', "L'email est requis."); valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('addEmail', "Format d'email invalide."); valid = false; }
        if (!valid) return;

        var users = JSON.parse(localStorage.getItem('archicoud_users') || '[]');
        var nextId = parseInt(localStorage.getItem('archicoud_nextId') || '9', 10);
        var now = new Date();
        var dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        users.push({
            id: nextId, nom: nom.toUpperCase(), prenom: prenom, email: email, tel: tel,
            role: role, dept: dept, statut: statut, color: color, derniere: dateStr
        });

        localStorage.setItem('archicoud_users', JSON.stringify(users));
        localStorage.setItem('archicoud_nextId', String(nextId + 1));
        // Afficher une notification si l'option est activée
if (isNotificationEnabled('ajout')) {
    showToast('✅ Utilisateur ajouté avec succès !', 'success');
}

        var msg = document.getElementById('addSuccessMsg');
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