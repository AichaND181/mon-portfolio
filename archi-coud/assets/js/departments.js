(function () {
    'use strict';

    var searchInput = document.getElementById('deptSearch');
    var typeSelect  = document.getElementById('deptType');
    var grid        = document.getElementById('deptGrid');
    var countEl     = document.getElementById('deptCount');

    if (!grid) return;

    function applyFilters() {
        var query   = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var typeVal = typeSelect  ? typeSelect.value : '';
        var cards   = grid.querySelectorAll('.dept-card');
        var visible = 0;

        cards.forEach(function (card) {
            var text    = card.textContent.toLowerCase();
            var cardType = card.getAttribute('data-type');
            var matchSearch = !query || text.indexOf(query) !== -1;
            var matchType   = !typeVal || cardType === typeVal;

            if (matchSearch && matchType) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countEl) {
            countEl.innerHTML = '<strong>' + visible + '</strong> entité' + (visible > 1 ? 's' : '') + ' affichée' + (visible > 1 ? 's' : '');
        }
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (typeSelect)  typeSelect.addEventListener('change', applyFilters);

    // Compteur initial
    var allCards = grid.querySelectorAll('.dept-card');
    if (countEl) {
        countEl.innerHTML = '<strong>' + allCards.length + '</strong> entités affichées';
    }
})();