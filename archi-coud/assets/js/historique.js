(function () {
    'use strict';

    var searchInput  = document.getElementById('historySearch');
    var typeSelect   = document.getElementById('historyType');
    var userSelect   = document.getElementById('historyUser');
    var timeline     = document.getElementById('timeline');
    var countDisplay = document.getElementById('historyCount');
    var emptyState   = document.getElementById('historyEmpty');

    if (!timeline) return;

    // ---- Fonction de filtrage principale ----
    function applyFilters() {
        var query    = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var typeVal  = typeSelect  ? typeSelect.value  : '';
        var userVal  = userSelect  ? userSelect.value  : '';

        var items = timeline.querySelectorAll('.timeline-item');
        var dates = timeline.querySelectorAll('.timeline-date');
        var visibleCount = 0;

        // Filtrer chaque item
        items.forEach(function (item) {
            var text     = item.textContent.toLowerCase();
            var tag      = item.querySelector('.tl-tag');
            var userEl   = item.querySelector('.tl-user');
            var tagText  = tag  ? tag.textContent.trim().toLowerCase()  : '';
            var userText = userEl ? userEl.textContent.trim().toLowerCase() : '';

            var matchSearch = !query || text.indexOf(query) !== -1;
            var matchType   = !typeVal || tagText === typeVal;
            var matchUser   = !userVal || userText === userVal.toLowerCase();

            if (matchSearch && matchType && matchUser) {
                item.style.display = '';
                item.classList.add('tl-visible');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.remove('tl-visible');
            }
        });

        // Masquer/afficher les dates selon si elles ont des items visibles
        dates.forEach(function (date) {
            var next = date.nextElementSibling;
            var hasVisible = false;
            while (next && !next.classList.contains('timeline-date')) {
                if (next.classList.contains('tl-visible')) hasVisible = true;
                next = next.nextElementSibling;
            }
            date.style.display = hasVisible ? '' : 'none';
        });

        // Compteur
        if (countDisplay) {
            countDisplay.innerHTML = '<strong>' + visibleCount + '</strong> activité' + (visibleCount > 1 ? 's' : '') + ' trouvée' + (visibleCount > 1 ? 's' : '');
        }

        // État vide
        if (emptyState) {
            emptyState.classList.toggle('visible', visibleCount === 0);
        }
    }

    // ---- Écouter les événements ----
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', applyFilters);
    }

    if (userSelect) {
        userSelect.addEventListener('change', applyFilters);
    }

    // ---- Compteur initial ----
    var allItems = timeline.querySelectorAll('.timeline-item');
    if (countDisplay) {
        countDisplay.innerHTML = '<strong>' + allItems.length + '</strong> activité' + (allItems.length > 1 ? 's' : '') + ' trouvée' + (allItems.length > 1 ? 's' : '');
    }

    // Marquer tous les items visibles au départ
    allItems.forEach(function (item) {
        item.classList.add('tl-visible');
    });

    // ============================================
    // IMPRIMER LE JOURNAL
    // ============================================
    window.printHistory = function () {
        window.print();
    };

    // ============================================
    // EXPORTER LE JOURNAL EN PDF
    // ============================================
    window.exportHistory = function () {
        if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            showToast('Chargement des librairies en cours, réessayez...', 'warning');
            return;
        }

        var overlay = document.getElementById('exportOverlay');
        if (overlay) overlay.classList.add('visible');

        setTimeout(function () {
            var element = document.querySelector('.page-content');

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#f1f5f9'
            }).then(function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var pdf = new jspdf.jsPDF('p', 'mm', 'a4');
                var imgWidth = 210;
                var pageHeight = 297;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('ARCHI-COUD_Journal_' + getDateStr() + '.pdf');

                if (overlay) overlay.classList.remove('visible');
                showToast('Journal exporté en PDF avec succès !', 'success');

            }).catch(function () {
                if (overlay) overlay.classList.remove('visible');
                showToast("Erreur lors de l'export, réessayez.", 'error');
            });
        }, 300);
    };

    // ---- Toast ----
    function showToast(message, type) {
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
    }

    function getDateStr() {
        var now = new Date();
        return now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    }

})();