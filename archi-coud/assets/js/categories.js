(function () {
    'use strict';

    var defaultCategories = [
        { id: 1,  nom: 'Courriers',                        code: 'COU',  icon: 'fa-envelope',            color: 'var(--blue-500)',   confidentiel: false, count: 2450, description: "Courriers arrivée et départ" },
        { id: 2,  nom: 'Décisions',                         code: 'DEC',  icon: 'fa-gavel',                color: 'var(--green-500)',  confidentiel: false, count: 620,  description: "Décisions administratives et de gestion" },
        { id: 3,  nom: 'Notes de service',                  code: 'NDS',  icon: 'fa-note-sticky',          color: 'var(--orange-500)', confidentiel: false, count: 480,  description: "Notes de service internes" },
        { id: 4,  nom: 'Rapports',                          code: 'RAP',  icon: 'fa-file-lines',           color: '#9333ea',           confidentiel: false, count: 890,  description: "Rapports d'activité et de gestion" },
        { id: 5,  nom: 'Procès-verbaux',                    code: 'PV',   icon: 'fa-file-signature',       color: 'var(--red-500)',    confidentiel: false, count: 540,  description: "PV d'ouverture, d'évaluation et d'attribution" },
        { id: 6,  nom: 'Ordres de mission',                 code: 'OM',   icon: 'fa-route',                color: '#0891b2',           confidentiel: false, count: 310,  description: "Ordres de mission du personnel" },
        { id: 7,  nom: 'Attestations de services faits',    code: 'ASF',  icon: 'fa-certificate',          color: '#ca8a04',           confidentiel: false, count: 970,  description: "Attestations de services faits" },
        { id: 8,  nom: 'Certificats administratifs',        code: 'CA',   icon: 'fa-stamp',                color: 'var(--gray-500)',   confidentiel: false, count: 210,  description: "Certificats administratifs divers" },
        { id: 9,  nom: 'Dossiers du Personnel',              code: 'DP',   icon: 'fa-id-badge',             color: 'var(--blue-700, #1d4ed8)', confidentiel: true,  count: 1340, description: "Dossiers individuels des agents" },
        { id: 10, nom: 'Dossiers médicaux',                 code: 'DM',   icon: 'fa-notes-medical',        color: 'var(--red-500)',    confidentiel: true,  count: 860,  description: "Dossiers médicaux étudiants et personnel" },
        { id: 11, nom: 'Bulletins de salaires',              code: 'BS',   icon: 'fa-money-check-dollar',   color: 'var(--green-500)',  confidentiel: true,  count: 1120, description: "Bulletins de paie du personnel" },
        { id: 12, nom: 'États financiers',                  code: 'EF',   icon: 'fa-chart-pie',            color: 'var(--orange-500)', confidentiel: true,  count: 540,  description: "États financiers et de retenues diverses" },
        { id: 13, nom: 'Factures',                          code: 'FAC',  icon: 'fa-file-invoice',         color: 'var(--blue-500)',   confidentiel: false, count: 1380, description: "Factures fournisseurs et prestataires" },
        { id: 14, nom: 'Conventions',                       code: 'CONV', icon: 'fa-handshake',            color: '#9333ea',           confidentiel: false, count: 260,  description: "Conventions d'hébergement et de partenariat" },
        { id: 15, nom: 'Documents comptables',              code: 'DC',   icon: 'fa-calculator',           color: '#0891b2',           confidentiel: true,  count: 780,  description: "Livres, carnets et pièces comptables" },
        { id: 16, nom: 'Dossiers contentieux',               code: 'DCT',  icon: 'fa-scale-balanced',       color: 'var(--red-500)',    confidentiel: true,  count: 190,  description: "Dossiers juridiques et contentieux" }
    ];

    if (!localStorage.getItem('archicoud_categories')) {
        localStorage.setItem('archicoud_categories', JSON.stringify(defaultCategories));
        localStorage.setItem('archicoud_cat_nextId', '17');
    }

    function getCategories() {
        try { return JSON.parse(localStorage.getItem('archicoud_categories')) || defaultCategories; }
        catch (e) { return defaultCategories; }
    }

    function saveCategories(data) {
        localStorage.setItem('archicoud_categories', JSON.stringify(data));
    }

    var searchInput     = document.getElementById('catSearch');
    var confFilter       = document.getElementById('catConfidentialiteFilter');
    var tableBody         = document.getElementById('catTableBody');
    var catCount          = document.getElementById('catCount');
    var paginationInfo    = document.getElementById('catPaginationInfo');

    function applyFilters() {
        var query   = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var confVal = confFilter  ? confFilter.value : '';

        var cats = getCategories();
        var filtered = cats.filter(function (c) {
            var text = (c.nom + ' ' + c.code + ' ' + (c.description || '')).toLowerCase();
            var matchSearch = !query || text.indexOf(query) !== -1;
            var matchConf   = !confVal ||
                (confVal === 'confidentiel' && c.confidentiel) ||
                (confVal === 'standard' && !c.confidentiel);
            return matchSearch && matchConf;
        });

        renderTable(filtered);
        if (catCount)       catCount.textContent = filtered.length + ' catégorie' + (filtered.length > 1 ? 's' : '');
        if (paginationInfo) paginationInfo.textContent = 'Affichage 1 - ' + filtered.length + ' sur ' + filtered.length + ' catégorie' + (filtered.length > 1 ? 's' : '');
    }

    function renderTable(data) {
        if (!tableBody) return;
        var html = '';
        data.forEach(function (c) {
            var confLabel = c.confidentiel ? 'Confidentielle' : 'Standard';
            var confClass = c.confidentiel ? 'confidentiel' : 'standard';
            var confIcon  = c.confidentiel ? 'fa-lock' : 'fa-lock-open';

            html += '<tr>' +
                '<td><div class="cat-cell"><div class="cat-icon" style="background:' + c.color + '"><i class="fas ' + c.icon + '"></i></div>' +
                    '<div class="cat-cell-info"><h5>' + c.nom + '</h5><span>' + (c.description || '') + '</span></div></div></td>' +
                '<td><span class="cat-code">' + c.code + '</span></td>' +
                '<td><span class="cat-doc-count">' + c.count.toLocaleString('fr-FR') + '<span> docs</span></span></td>' +
                '<td><span class="confidentiality-badge ' + confClass + '"><i class="fas ' + confIcon + '"></i>' + confLabel + '</span></td>' +
                '<td><div class="action-btns">' +
                    '<button title="Modifier" onclick="openEditTab(' + c.id + ')"><i class="fas fa-pen"></i></button>' +
                    '<button title="Supprimer" onclick="openDeleteTab(' + c.id + ')"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        });
        tableBody.innerHTML = html;
    }

    // ---- Ouvrir dans un nouvel onglet ----
    window.openAddTab  = function () { window.open('category-add.html', '_blank'); };
    window.openEditTab = function (id) {
        localStorage.setItem('archicoud_cat_edit_id', String(id));
        window.open('category-edit.html', '_blank');
    };

    // ---- Suppression (ouvre un onglet de confirmation) ----
    window.openDeleteTab = function (id) {
        localStorage.setItem('archicoud_cat_delete_id', String(id));
        window.open('category-delete.html', '_blank');
    };

    // ---- Écouteurs ----
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (confFilter)  confFilter.addEventListener('change', applyFilters);

    // ---- Rafraîchir quand l'onglet reprend le focus (ex: après ajout/modif) ----
    window.addEventListener('focus', function () { applyFilters(); });
    applyFilters();
})();