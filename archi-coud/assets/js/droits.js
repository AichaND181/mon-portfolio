(function () {
    'use strict';

    var categories = [
        'Courriers',
        'Décisions',
        'Rapports & PV',
        'Dossiers Personnel',
        'Dossiers Médicaux',
        'Documents Comptables',
        'Plans & Cartes'
    ];

    var departments = [
        { id: 'direction',       name: 'Direction',                                icon: 'fas fa-crown' },
        { id: 'bureau_courrier', name: 'Bureau Courrier',                          icon: 'fas fa-envelope-open-text' },
        { id: 'budget',          name: 'Département du Budget',                   icon: 'fas fa-coins' },
        { id: 'marches',         name: 'Cellule de Passation des Marchés',         icon: 'fas fa-gavel' },
        { id: 'capital',         name: 'Département du Capital Humain',            icon: 'fas fa-users' },
        { id: 'sante',           name: 'Santé & Action Sociale',                   icon: 'fas fa-heart-pulse' },
        { id: 'techniques',      name: 'Département des Services Techniques',       icon: 'fas fa-wrench' },
        { id: 'cites',           name: 'Département des Cités Universitaires',      icon: 'fas fa-building' },
        { id: 'moyens',          name: 'Département des Moyens Généraux',          icon: 'fas fa-boxes-stacked' },
        { id: 'culture',         name: 'Activités Culturelles et Sportives',       icon: 'fas fa-masks-theater' },
        { id: 'informatique',    name: 'Département Informatique',                 icon: 'fas fa-laptop-code' },
        { id: 'environnement',   name: 'Département de l\'Environnement',           icon: 'fas fa-leaf' },
        { id: 'restauration',    name: 'Restauration Universitaire',               icon: 'fas fa-utensils' },
        { id: 'securite',        name: 'Unité de Sécurité',                        icon: 'fas fa-shield' },
        { id: 'agence',          name: 'Agence Comptable Particulier',             icon: 'fas fa-receipt' },
        { id: 'audit',           name: 'Cellule de l\'Audit Interne',               icon: 'fas fa-magnifying-glass-chart' },
        { id: 'communication',   name: 'Cellule Communication',                     icon: 'fas fa-bullhorn' },
        { id: 'cooperation',     name: 'Cellule de la Coopération',                icon: 'fas fa-handshake' },
        { id: 'ctrl_interne',    name: 'Cellule Contrôle Interne',                 icon: 'fas fa-clipboard-check' },
        { id: 'ctrl_gestion',    name: 'Cellule Contrôle de Gestion',              icon: 'fas fa-chart-pie' },
        { id: 'juridique',       name: 'Cellule Juridique',                        icon: 'fas fa-scale-balanced' },
        { id: 'suivi',           name: 'Cellule Suivi',                             icon: 'fas fa-eye' }
    ];

    var defaultRights = {
        direction:        { 'Courriers': 'admin', 'Décisions': 'admin', 'Rapports & PV': 'admin', 'Dossiers Personnel': 'ecriture', 'Dossiers Médicaux': 'lecture', 'Documents Comptables': 'ecriture', 'Plans & Cartes': 'lecture' },
        bureau_courrier:  { 'Courriers': 'admin', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        budget:           { 'Courriers': 'ecriture', 'Décisions': 'ecriture', 'Rapports & PV': 'ecriture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        marches:          { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'admin', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        capital:          { 'Courriers': 'ecriture', 'Décisions': 'ecriture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'admin', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'lecture', 'Plans & Cartes': 'aucun' },
        sante:            { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'admin', 'Documents Comptables': 'lecture', 'Plans & Cartes': 'aucun' },
        techniques:       { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'lecture', 'Plans & Cartes': 'admin' },
        cites:            { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'ecriture', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        moyens:           { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        culture:          { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'ecriture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        informatique:     { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        environnement:    { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        restauration:     { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        securite:         { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'aucun', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        agence:           { 'Courriers': 'ecriture', 'Décisions': 'ecriture', 'Rapports & PV': 'ecriture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        audit:            { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'admin', 'Dossiers Personnel': 'lecture', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        communication:    { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        cooperation:      { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'lecture', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' },
        ctrl_interne:     { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'admin', 'Dossiers Personnel': 'lecture', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        ctrl_gestion:     { 'Courriers': 'lecture', 'Décisions': 'lecture', 'Rapports & PV': 'admin', 'Dossiers Personnel': 'lecture', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'admin', 'Plans & Cartes': 'aucun' },
        juridique:        { 'Courriers': 'ecriture', 'Décisions': 'ecriture', 'Rapports & PV': 'ecriture', 'Dossiers Personnel': 'lecture', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'lecture', 'Plans & Cartes': 'aucun' },
        suivi:            { 'Courriers': 'ecriture', 'Décisions': 'lecture', 'Rapports & PV': 'aucun', 'Dossiers Personnel': 'aucun', 'Dossiers Médicaux': 'aucun', 'Documents Comptables': 'aucun', 'Plans & Cartes': 'aucun' }
    };

    var currentRights = {};

    function loadRights() {
        var saved = localStorage.getItem('archicoud_droits');
        if (saved) {
            try { currentRights = JSON.parse(saved); } catch (e) { currentRights = JSON.parse(JSON.stringify(defaultRights)); }
        } else {
            currentRights = JSON.parse(JSON.stringify(defaultRights));
        }
    }

    loadRights();

    function renderTable() {
        var thead = document.getElementById('droitsThead');
        var tbody = document.getElementById('droitsTbody');
        if (!thead || !tbody) return;

        var headHtml = '<th>Département</th>';
        categories.forEach(function (cat) { headHtml += '<th>' + cat + '</th>'; });
        thead.innerHTML = headHtml;

        var bodyHtml = '';
        departments.forEach(function (dept) {
            bodyHtml += '<tr>';
            bodyHtml += '<td><div class="dept-cell"><div class="dept-icon-sm"><i class="' + dept.icon + '"></i></div><span class="dept-name">' + dept.name + '</span></div></td>';
            categories.forEach(function (cat) {
                var right = (currentRights[dept.id] && currentRights[dept.id][cat]) ? currentRights[dept.id][cat] : 'aucun';
                bodyHtml += '<td><select class="right-select right-' + right + '" data-dept="' + dept.id + '" data-cat="' + cat + '">';
                bodyHtml += '<option value="admin"' + (right === 'admin' ? ' selected' : '') + '>Admin</option>';
                bodyHtml += '<option value="ecriture"' + (right === 'ecriture' ? ' selected' : '') + '>Écriture</option>';
                bodyHtml += '<option value="lecture"' + (right === 'lecture' ? ' selected' : '') + '>Lecture</option>';
                bodyHtml += '<option value="aucun"' + (right === 'aucun' ? ' selected' : '') + '>Aucun accès</option>';
                bodyHtml += '</select></td>';
            });
            bodyHtml += '</tr>';
        });
        tbody.innerHTML = bodyHtml;

        tbody.querySelectorAll('.right-select').forEach(function (sel) {
            sel.addEventListener('change', function () {
                var deptId = this.getAttribute('data-dept');
                var cat = this.getAttribute('data-cat');
                if (!currentRights[deptId]) currentRights[deptId] = {};
                currentRights[deptId][cat] = this.value;
                this.className = 'right-select right-' + this.value;
                updateSummary();
            });
        });

        updateSummary();
    }

    function updateSummary() {
        var total = 0, a = 0, e = 0, l = 0, n = 0;
        departments.forEach(function (dept) {
            categories.forEach(function (cat) {
                total++;
                var r = (currentRights[dept.id] && currentRights[dept.id][cat]) ? currentRights[dept.id][cat] : 'aucun';
                if (r === 'admin') a++;
                else if (r === 'ecriture') e++;
                else if (r === 'lecture') l++;
                else n++;
            });
        });
        setVal('sumAdmin', a);
        setVal('sumEcriture', e);
        setVal('sumLecture', l);
        setVal('sumAucun', n);
    }

    function setVal(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

    window.saveDroits = function () {
        document.querySelectorAll('#droitsTbody .right-select').forEach(function (sel) {
            var d = sel.getAttribute('data-dept');
            var c = sel.getAttribute('data-cat');
            if (!currentRights[d]) currentRights[d] = {};
            currentRights[d][c] = sel.value;
        });
        localStorage.setItem('archicoud_droits', JSON.stringify(currentRights));
        showToast('Droits d\'accès sauvegardés avec succès !', 'success');
    };

    window.resetDroits = function () {
        currentRights = JSON.parse(JSON.stringify(defaultRights));
        localStorage.removeItem('archicoud_droits');
        renderTable();
        showToast('Droits réinitialisés aux valeurs par défaut.', 'warning');
    };

    window.applyToColumn = function (cat, right) {
        departments.forEach(function (dept) {
            if (!currentRights[dept.id]) currentRights[dept.id] = {};
            currentRights[dept.id][cat] = right;
        });
        renderTable();
    };

    function showToast(message, type) {
        var existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        var icons = { success: 'fas fa-check-circle', error: 'fas fa-circle-exclamation', warning: 'fas fa-triangle-exclamation' };
        var colors = { success: '#15803d', error: '#b91c1c', warning: '#ca8a04' };
        var toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = '<i class="' + (icons[type] || icons.success) + '" style="color:' + (colors[type] || colors.success) + '"></i> ' + message + '<div class="toast-progress" style="background:' + (colors[type] || colors.success) + '"></div>';
        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('toast-out'); setTimeout(function () { toast.remove(); }, 300); }, 3000);
    }

    renderTable();
})();