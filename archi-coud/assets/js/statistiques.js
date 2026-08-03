(function () {
    'use strict';

    // ---- Animate bar chart on scroll ----
    var barChart = document.querySelector('.bar-chart');

    if (barChart) {
        var bars = barChart.querySelectorAll('.bar');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    bars.forEach(function (bar) {
                        var h = bar.getAttribute('data-height');
                        bar.style.height = '0%';
                        setTimeout(function () {
                            bar.style.height = h + '%';
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(barChart);
    }

    // ---- Animate stat numbers ----
    var nums = document.querySelectorAll('.sm-value');
    var numObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var text = el.textContent.trim();
                var target = parseInt(text.replace(/[\s%k+GB]/g, ''), 10);
                if (isNaN(target)) { numObserver.unobserve(el); return; }
                var hasPercent = text.indexOf('%') !== -1;
                var hasK = text.indexOf('k') !== -1;
                var hasPlus = text.indexOf('+') !== -1;
                var hasGB = text.indexOf('GB') !== -1;
                var start = performance.now();

                function update(now) {
                    var elapsed = now - start;
                    var progress = Math.min(elapsed / 1200, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    var current = Math.floor(eased * target);
                    var display = current.toLocaleString('fr-FR').replace(/\s/g, ' ');
                    if (hasPercent) display += '%';
                    if (hasK) display += 'k';
                    if (hasPlus) display += '+';
                    if (hasGB) display += 'GB';
                    el.textContent = display;
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                numObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    nums.forEach(function (n) { numObserver.observe(n); });

    // ============================================
    // IMPRIMER
    // ============================================
    window.printStats = function () {
        // Forcer les barres à leur taille finale pour l'impression
        var allBars = document.querySelectorAll('.bar[data-height]');
        var savedHeights = [];
        allBars.forEach(function (bar, i) {
            savedHeights[i] = bar.style.height;
            bar.style.height = bar.getAttribute('data-height') + '%';
        });

        window.print();

        // Restaurer après l'impression
        setTimeout(function () {
            allBars.forEach(function (bar, i) {
                bar.style.height = savedHeights[i];
            });
        }, 500);
    };

    // ============================================
    // EXPORTER PDF
    // ============================================
    window.exportPDF = function () {
        if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            showToast('Chargement des librairies en cours, réessayez...', 'warning');
            return;
        }

        var overlay = document.getElementById('exportOverlay');
        if (overlay) overlay.classList.add('visible');

        // Sauvegarder et forcer les tailles des barres
        var allBars = document.querySelectorAll('.bar[data-height]');
        var savedHeights = [];
        allBars.forEach(function (bar, i) {
            savedHeights[i] = bar.style.height;
            bar.style.transition = 'none';
            bar.style.height = bar.getAttribute('data-height') + '%';
        });

        // Petit délai pour que le navigateur applique les tailles
        setTimeout(function () {
            var element = document.querySelector('.page-content');

            html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#f1f5f9'
            }).then(function (canvas) {
                // Restaurer les barres
                allBars.forEach(function (bar, i) {
                    bar.style.transition = '';
                    bar.style.height = savedHeights[i];
                });

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

                pdf.save('ARCHICOUD_Statistiques_' + getDateStr() + '.pdf');

                if (overlay) overlay.classList.remove('visible');
                showToast('PDF exporté avec succès !', 'success');

            }).catch(function () {
                allBars.forEach(function (bar, i) {
                    bar.style.transition = '';
                    bar.style.height = savedHeights[i];
                });
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

    // ============================================
    // RECHERCHE — Filtrer le tableau des départements
    // ============================================
    var statsSearch = document.getElementById('statsSearch');
    var deptTableBody = document.querySelector('.stats-table-section tbody');

    if (statsSearch && deptTableBody) {
        var deptRows = Array.prototype.slice.call(deptTableBody.querySelectorAll('tr'));

        statsSearch.addEventListener('input', function () {
            var query = statsSearch.value.toLowerCase().trim();

            deptRows.forEach(function (row) {
                var deptName = row.querySelector('td strong');
                var text = deptName ? deptName.textContent.toLowerCase() : '';
                row.style.display = (!query || text.indexOf(query) !== -1) ? '' : 'none';
            });
        });
    }

})();