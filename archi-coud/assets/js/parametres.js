(function () {
    'use strict';

    // ---- Onglets ----
    var navLinks = document.querySelectorAll('.settings-nav a');
    var sections = document.querySelectorAll('.settings-section');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = this.getAttribute('data-section');
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            this.classList.add('active');
            sections.forEach(function (s) { s.classList.remove('active'); });
            var el = document.getElementById(target);
            if (el) el.classList.add('active');
        });
    });

    // ============================================
    // CHARGEMENT DES VALEURS SAUVEGARDÉES
    // ============================================
    function loadSettings() {
        // Profil
        var saved = localStorage.getItem('archicoud_profil');
        if (saved) {
            try {
                var data = JSON.parse(saved);
                setVal('profilNom', data.nom);
                setVal('profilPrenom', data.prenom);
                setVal('profilEmail', data.email);
                setVal('profilTel', data.tel);
                setVal('profilFonction', data.fonction);
            } catch (e) { /* ignore */ }
        }

        // Archives
        var savedArchives = localStorage.getItem('archicoud_archives');
        if (savedArchives) {
            try {
                var data = JSON.parse(savedArchives);
                setVal('archiveFormat', data.format);
                setVal('archiveDPI', data.dpi);
                setVal('archiveCouleur', data.couleur);
                setVal('archiveNomenclature', data.nomenclature);
            } catch (e) { /* ignore */ }
        }

        // Notifications (toggles)
        var savedNotifs = localStorage.getItem('archicoud_notifications');
        if (savedNotifs) {
            try {
                var notifs = JSON.parse(savedNotifs);
                setToggle('notifAjout', notifs.ajout);
                setToggle('notifModif', notifs.modification);
                setToggle('notifSuppr', notifs.suppression);
                setToggle('notifConnexion', notifs.connexion);
                setToggle('notifHebdo', notifs.hebdomadaire);
            } catch (e) { /* ignore */ }
        }
    }

    function setVal(id, value) {
        var el = document.getElementById(id);
        if (el && value !== undefined && value !== null) el.value = value;
    }

    function setToggle(id, value) {
        var el = document.getElementById(id);
        if (el) el.checked = !!value;
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
    }

    function getToggle(id) {
        var el = document.getElementById(id);
        return el ? el.checked : false;
    }

    // Charger au démarrage
    loadSettings();

    // ============================================
    // SAUVEGARDE PROFIL
    // ============================================
    window.saveProfil = function () {
        var data = {
            nom: getVal('profilNom'),
            prenom: getVal('profilPrenom'),
            email: getVal('profilEmail'),
            tel: getVal('profilTel'),
            fonction: getVal('profilFonction')
        };
        localStorage.setItem('archicoud_profil', JSON.stringify(data));

        // Mettre à jour le sidebar user si présent
        var fullName = data.prenom + ' ' + data.nom;
        var nameEl = document.querySelector('.sidebar-user .name');
        if (nameEl) nameEl.textContent = fullName;

        // Mettre à jour l'avatar
        var avatarEl = document.querySelector('.sidebar-user .avatar');
        if (avatarEl && data.prenom && data.nom) {
            avatarEl.textContent = data.prenom.charAt(0) + data.nom.charAt(0);
        }

        // Mettre à jour le badge déconnexion
        var badgeName = document.getElementById('logoutUserName');
        if (badgeName) badgeName.textContent = fullName;

        showToast('Profil sauvegardé avec succès !', 'success');
    };

    // ============================================
    // SAUVEGARDE MOT DE PASSE
    // ============================================
    window.savePassword = function () {
        var current  = getVal('secuCurrent');
        var nouveau  = getVal('secuNew');
        var confirm  = getVal('secuConfirm');

        if (!current) {
            showToast('Veuillez saisir le mot de passe actuel.', 'error');
            return;
        }
        if (!nouveau || nouveau.length < 8) {
            showToast('Le nouveau mot de passe doit contenir au moins 8 caractères.', 'error');
            return;
        }
        if (nouveau !== confirm) {
            showToast('Les deux mots de passe ne correspondent pas.', 'error');
            return;
        }

        // Enregistrer le nouveau mot de passe en localStorage (simulation)
        localStorage.setItem('archicoud_password', nouveau);

        // Vider les champs
        setVal('secuCurrent', '');
        setVal('secuNew', '');
        setVal('secuConfirm', '');

        showToast('Mot de passe mis à jour avec succès !', 'success');
    };

    // ============================================
    // SAUVEGARDE ARCHIVES
    // ============================================
    window.saveArchives = function () {
        var data = {
            format: getVal('archiveFormat'),
            dpi: getVal('archiveDPI'),
            couleur: getVal('archiveCouleur'),
            nomenclature: getVal('archiveNomenclature')
        };
        localStorage.setItem('archicoud_archives', JSON.stringify(data));
        showToast('Configuration des archives sauvegardée !', 'success');
    };

    // ============================================
    // SAUVEGARDE NOTIFICATIONS
    // ============================================
    window.saveNotifications = function () {
        var data = {
            ajout: getToggle('notifAjout'),
            modification: getToggle('notifModif'),
            suppression: getToggle('notifSuppr'),
            connexion: getToggle('notifConnexion'),
            hebdomadaire: getToggle('notifHebdo')
        };
        localStorage.setItem('archicoud_notifications', JSON.stringify(data));
        showToast('Préférences de notification sauvegardées !', 'success');
    };

    // ============================================
    // DÉCONNEXION : géré globalement par main.js (openLogoutModal,
    // closeLogoutModal, confirmLogout) car le bouton est maintenant
    // dans la navbar présente sur toutes les pages.
    // ============================================

    // ============================================
    // TOAST
    // ============================================
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

    // ============================================
// SYSTÈME — Chargement des données depuis localStorage
// ============================================
function loadSystemData() {
    var saved = localStorage.getItem('archicoud_system');
    if (saved) {
        try {
            var data = JSON.parse(saved);
            setVal('sysVolume', data.volume);
            setVal('sysDocsNum', data.documents);
            setVal('sysDepts', data.departements);
            setVal('sysCategories', data.categories);
            setVal('sysStorage', data.stockage);
            setVal('sysBackup', data.sauvegarde);
            setVal('sysUsers', data.utilisateurs);
            setVal('sysStatus', data.statut);
        } catch (e) { /* ignore */ }
    }
}

// Sauvegarder les données système (si on veut les modifier)
function saveSystemData() {
    var data = {
        volume: getVal('sysVolume'),
        documents: getVal('sysDocsNum'),
        departements: getVal('sysDepts'),
        categories: getVal('sysCategories'),
        stockage: getVal('sysStorage'),
        sauvegarde: getVal('sysBackup'),
        utilisateurs: getVal('sysUsers'),
        statut: getVal('sysStatus')
    };
    localStorage.setItem('archicoud_system', JSON.stringify(data));
    showToast('Données système mises à jour !', 'success');
}

// Initialiser avec des valeurs par défaut (issues du PDF)
function initSystemDefaults() {
    var defaults = {
        volume: '500 mètres linéaires',
        documents: '2 847 numérisés',
        departements: '18 départements',
        categories: '15 types documentaires',
        stockage: '48 GB / 200 GB (24%)',
        sauvegarde: '15 Janvier 2025 à 03:00',
        utilisateurs: '6 / 8 comptes actifs',
        statut: '🟢 Opérationnelle'
    };
    
    // Ne pas écraser si déjà existant
    if (!localStorage.getItem('archicoud_system')) {
        localStorage.setItem('archicoud_system', JSON.stringify(defaults));
    }
}

// Appeler au démarrage
initSystemDefaults();
loadSystemData();

// ============================================
// ACTIONS SYSTÈME
// ============================================
window.manualBackup = function() {
    // Mettre à jour la date de sauvegarde
    var now = new Date();
    var dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    var timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    var backupDate = dateStr + ' à ' + timeStr;
    
    setVal('sysBackup', backupDate);
    saveSystemData();
    showToast('Sauvegarde manuelle effectuée à ' + timeStr, 'success');
};

window.clearCache = function() {
    // Simuler le vidage du cache
    showToast('Cache vidé avec succès !', 'warning');
};

window.refreshSystem = function() {
    // Recharger les données depuis localStorage
    loadSystemData();
    showToast('Données système actualisées', 'success');
};

})();