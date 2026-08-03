(function () {
    'use strict';

    var COLORS = [
        'var(--blue-500)', 'var(--green-500)', 'var(--orange-500)',
        '#9333ea', 'var(--red-500)', 'var(--gray-500)',
        '#0891b2', '#ca8a04'
    ];

    // Couleur sélectionnée par défaut
    var selectedColor = COLORS[0];

    var picker = document.getElementById('addColorPicker');
    if (picker) {
        COLORS.forEach(function (c, i) {
            var div = document.createElement('div');
            div.className = 'avatar-choice' + (i === 0 ? ' selected' : '');
            div.style.background = c;
            div.setAttribute('data-color', c);
            div.addEventListener('click', function () {
                picker.querySelectorAll('.avatar-choice').forEach(function (el) { el.classList.remove('selected'); });
                div.classList.add('selected');
                selectedColor = c;
            });
            picker.appendChild(div);
        });
    }

    function getCategories() {
        try { return JSON.parse(localStorage.getItem('archicoud_categories')) || []; }
        catch (e) { return []; }
    }

    function saveCategories(data) {
        localStorage.setItem('archicoud_categories', JSON.stringify(data));
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

    window.saveNewCategory = function () {
        clearErrors();
        var valid = true;

        var nom = getVal('addNom');
        var code = getVal('addCode').toUpperCase();
        var description = getVal('addDescription');
        var icon = getVal('addIcon');
        var confidentiel = getVal('addConfidentiel') === 'oui';

        if (!nom)  { showErr('addNom', 'Le nom de la catégorie est requis.'); valid = false; }
        if (!code) { showErr('addCode', 'Le code est requis.'); valid = false; }
        else if (!/^[A-Z0-9]{2,6}$/.test(code)) { showErr('addCode', '2 à 6 lettres/chiffres, sans espace.'); valid = false; }

        var cats = getCategories();
        if (code && cats.some(function (c) { return c.code === code; })) {
            showErr('addCode', 'Ce code est déjà utilisé.'); valid = false;
        }

        if (!valid) return;

        var nextId = parseInt(localStorage.getItem('archicoud_cat_nextId') || '1', 10);
        var newCat = {
            id: nextId,
            nom: nom,
            code: code,
            icon: icon,
            color: selectedColor,
            confidentiel: confidentiel,
            count: 0,
            description: description
        };

        cats.push(newCat);
        saveCategories(cats);
        localStorage.setItem('archicoud_cat_nextId', String(nextId + 1));

        var msg = document.getElementById('addSuccessMsg');
        if (msg) msg.classList.add('visible');
        document.querySelector('.form-actions').style.display = 'none';

        setTimeout(function () { window.close(); }, 1500);
    };
})();