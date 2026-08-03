(function () {
    'use strict';

    var defaultDocuments = [
        { id: 1, code: 'COU-2025-001', titre: 'Courrier arrivée Ministère', type: 'Courrier', departement: 'Direction', statut: 'numerise', date: '15/01/2025' },
        { id: 2, code: 'PV-2025-001', titre: 'PV réunion conseil', type: 'PV', departement: 'Budget', statut: 'en_cours', date: '14/01/2025' },
        { id: 3, code: 'RAP-2025-001', titre: 'Rapport activité mensuel', type: 'Rapport', departement: 'Capital Humain', statut: 'numerise', date: '14/01/2025' },
        { id: 4, code: 'BUD-2025-001', titre: 'Budget prévisionnel 2025', type: 'Budget', departement: 'Budget', statut: 'a_traiter', date: '13/01/2025' },
        { id: 5, code: 'COU-2025-002', titre: 'Courrier départ université', type: 'Courrier', departement: 'Direction', statut: 'numerise', date: '12/01/2025' }
    ];

    if (!localStorage.getItem('archicoud_documents')) {
        localStorage.setItem('archicoud_documents', JSON.stringify(defaultDocuments));
        localStorage.setItem('archicoud_doc_nextId', '6');
    }

    function getDocuments() {
        try { return JSON.parse(localStorage.getItem('archicoud_documents')) || defaultDocuments; }
        catch (e) { return defaultDocuments; }
    }

    function saveDocuments(data) {
        localStorage.setItem('archicoud_documents', JSON.stringify(data));
    }

    var searchInput = document.getElementById('recherche-documents');
    var typeFilter = document.getElementById('filtre-type');
    var deptFilter = document.getElementById('filtre-departement');
    var statutFilter = document.getElementById('filtre-statut');
    var tableBody = document.getElementById('corps-tableau-documents');
    var statTotal = document.getElementById('stat-total');
    var statNumerises = document.getElementById('stat-numerises');
    var statEnCours = document.getElementById('stat-en-cours');
    var statATraiter = document.getElementById('stat-a-traiter');

    function applyFilters() {
        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var typeVal = typeFilter ? typeFilter.value : '';
        var deptVal = deptFilter ? deptFilter.value : '';
        var statutVal = statutFilter ? statutFilter.value : '';

        var docs = getDocuments();
        var filtered = docs.filter(function (d) {
            var text = (d.code + ' ' + d.titre + ' ' + d.departement).toLowerCase();
            var matchSearch = !query || text.indexOf(query) !== -1;
            var matchType = !typeVal || d.type === typeVal;
            var matchDept = !deptVal || d.departement === deptVal;
            var matchStatut = !statutVal || d.statut === statutVal;
            return matchSearch && matchType && matchDept && matchStatut;
        });

        filtered.sort(function(a, b) { return b.id - a.id; });
        renderTable(filtered);
        updateStats(filtered);
    }

    function renderTable(data) {
        if (!tableBody) return;
        var html = '';
        data.forEach(function (d) {
            var statutLabels = { numerise: 'Numérisé', en_cours: 'En cours', a_traiter: 'À traiter' };
            var statutLabel = statutLabels[d.statut] || d.statut;

            html += '<tr>' +
                '<td><span class="code-cellule">' + d.code + '</span></td>' +
                '<td>' + d.titre + '</td>' +
                '<td>' + d.departement + '</td>' +
                '<td>' + d.type + '</td>' +
                '<td><span class="badge-statut ' + d.statut + '">' + statutLabel + '</span></td>' +
                '<td><div class="actions-tableau">' +
                    '<button title="Voir"><i class="fas fa-eye"></i></button>' +
                    '<button title="Modifier"><i class="fas fa-pen"></i></button>' +
                    '<button title="Supprimer"><i class="fas fa-trash"></i></button>' +
                '</div></td></tr>';
        });
        tableBody.innerHTML = html;

        var noResult = document.getElementById('message-aucun-resultat');
        if (noResult) noResult.style.display = data.length === 0 ? 'block' : 'none';
    }

    function updateStats(data) {
        if (statTotal) statTotal.textContent = data.length;
        if (statNumerises) statNumerises.textContent = data.filter(function(d) { return d.statut === 'numerise'; }).length;
        if (statEnCours) statEnCours.textContent = data.filter(function(d) { return d.statut === 'en_cours'; }).length;
        if (statATraiter) statATraiter.textContent = data.filter(function(d) { return d.statut === 'a_traiter'; }).length;
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (deptFilter) deptFilter.addEventListener('change', applyFilters);
    if (statutFilter) statutFilter.addEventListener('change', applyFilters);

    var filterBtn = document.getElementById('bouton-filtrer');
    var resetBtn = document.getElementById('bouton-reinitialiser');

    if (filterBtn) filterBtn.addEventListener('click', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (typeFilter) typeFilter.value = '';
            if (deptFilter) deptFilter.value = '';
            if (statutFilter) statutFilter.value = '';
            applyFilters();
        });
    }

    applyFilters();
})();
