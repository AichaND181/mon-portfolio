(function () {
    'use strict';

    var COLORS = [
        'var(--blue-500)', 'var(--green-500)', 'var(--orange-500)',
        '#9333ea', 'var(--red-500)', 'var(--gray-500)',
        '#0891b2', '#ca8a04'
    ];

    var editId = parseInt(localStorage.getItem('archicoud_cat_edit_id') || '0', 10);
    var cats = JSON.parse(localStorage.getItem('archicoud_categories') || '[]');
    var cat = null;
    for (var i = 0; i < cats.length; i++) {
        if (cats[i].id === editId) { cat = cats[i]; break; }
    }

    if (cat) {
        document.getElementById('editNom').value = cat.nom;
        document.getElementById('editCode').value = cat.code;
        document.getElementById('editDescription').value = cat.description || '';
        document.getElementById('editIcon').value = cat.icon;
        document.getElementById('editConfidentiel').value = cat.confidentiel ? 'oui' : 'non';
    } else {
        document.querySelector('.sc-header h3').innerHTML = '<i class="fas fa-triangle-exclamation" style="color:var(--red-500)"></i> Catégorie introuvable';
    }

    var picker = document.getElementById('editColorPicker');
    if (picker) {
        COLORS.forEach(function (c) {
            var div = document.createElement('div');
            div.className = 'avatar-choice' + (cat && c === cat.color ? ' selected' : '');
            div.style.background = c;
            div.setAttribute('data-color', c);
            div.addEventListener('click', function () {
                picker.querySelectorAll('.avatar-choice').forEach(function (el) { el.classList.remove('selected'); });
                div.classList.add('selected');
            });
            picker.appendChild(div);
        });
    }

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

    window.saveEditCategory = function () {
        if (!cat) return;
        clearErrors();
        var valid = true;

        var nom = getVal('editNom');
        var code = getVal('editCode').toUpperCase();
        var description = getVal('editDescription');
        var icon = getVal('editIcon');
        var confidentiel = getVal('editConfidentiel') === 'oui';
        var sel = document.querySelector('#editColorPicker .avatar-choice.selected');
        var color = sel ? sel.getAttribute('data-color') : cat.color;

        if (!nom)  { showErr('editNom', 'Le nom de la catégorie est requis.'); valid = false; }
        if (!code) { showErr('editCode', 'Le code est requis.'); valid = false; }
        else if (!/^[A-Z0-9]{2,6}$/.test(code)) { showErr('editCode', '2 à 6 lettres/chiffres, sans espace.'); valid = false; }
        else if (cats.some(function (c) { return c.code === code && c.id !== cat.id; })) {
            showErr('editCode', 'Ce code est déjà utilisé par une autre catégorie.'); valid = false;
        }

        if (!valid) return;

        cat.nom = nom; cat.code = code; cat.description = description;
        cat.icon = icon; cat.confidentiel = confidentiel; cat.color = color;

        localStorage.setItem('archicoud_categories', JSON.stringify(cats));

        var msg = document.getElementById('editSuccessMsg');
        if (msg) msg.classList.add('visible');
        document.querySelector('.form-actions').style.display = 'none';

        setTimeout(function () { window.close(); }, 1500);
    };
})();