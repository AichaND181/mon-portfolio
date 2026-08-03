(function () {
    'use strict';

    var deleteId = parseInt(localStorage.getItem('archicoud_cat_delete_id') || '0', 10);
    var cats = JSON.parse(localStorage.getItem('archicoud_categories') || '[]');
    var cat = null;

    for (var i = 0; i < cats.length; i++) {
        if (cats[i].id === deleteId) { cat = cats[i]; break; }
    }

    if (cat) {
        var iconEl = document.getElementById('deleteCatIcon');
        if (iconEl) {
            iconEl.style.background = cat.color;
            iconEl.innerHTML = '<i class="fas ' + cat.icon + '"></i>';
        }
        var nameEl = document.getElementById('deleteCatName');
        if (nameEl) nameEl.textContent = cat.nom;
        var codeEl = document.getElementById('deleteCatCode');
        if (codeEl) codeEl.textContent = cat.code + (cat.confidentiel ? ' · Confidentielle' : ' · Standard');

        if (cat.count > 0) {
            var warnEl = document.getElementById('deleteWarning');
            if (warnEl) {
                warnEl.textContent = 'Attention : ' + cat.count.toLocaleString('fr-FR') + ' document(s) sont actuellement rattachés à cette catégorie.';
                warnEl.style.cssText = 'display:block;margin-top:14px;padding:12px 16px;background:#fef3c7;color:#b45309;border-radius:var(--radius-sm);font-size:13px;font-weight:600;';
            }
        }
    } else {
        document.querySelector('.sc-header h3').innerHTML = '<i class="fas fa-triangle-exclamation" style="color:var(--red-500)"></i> Catégorie introuvable';
    }

    window.confirmDeleteCategory = function () {
        if (!cat) return;

        cats = cats.filter(function (c) { return c.id !== deleteId; });
        localStorage.setItem('archicoud_categories', JSON.stringify(cats));

        var msg = document.getElementById('deleteSuccessMsg');
        if (msg) msg.classList.add('visible');
        document.querySelector('.delete-actions').style.display = 'none';

        setTimeout(function () { window.close(); }, 1500);
    };
})();