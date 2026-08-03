(function () {
    'use strict';

    var USERS = [
        { username: 'admin',     password: 'admin',     name: 'Coumba D. NIANG', role: 'Cheffe du BAD',   redirect: 'dashboard.html' },
        { username: 'bad',       password: 'bad',       name: 'Archiviste BAD',   role: 'Agent Archives',   redirect: 'dashboard.html' },
        { username: 'budget',    password: 'budget',    name: 'Agent Budget',     role: 'Dépt. Budget',     redirect: 'dashboard.html' },
        { username: 'rh',        password: 'rh',        name: 'Agent RH',         role: 'Capital Humain',   redirect: 'dashboard.html' },
        { username: 'direction', password: 'direction', name: 'Direction COUD',   role: 'Administrateur',   redirect: 'dashboard.html' }
    ];

    var form          = document.getElementById('loginForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var btnLogin      = document.getElementById('btnLogin');
    var errorBox      = document.getElementById('formError');
    var successBox    = document.getElementById('formSuccess');
    var errorMsg      = document.getElementById('errorMsg');
    var togglePwdBtns = document.querySelectorAll('.toggle-password');

    togglePwdBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var input = document.getElementById(btn.getAttribute('data-target'));
            if (input.type === 'password') {
                input.type = 'text';
                btn.classList.remove('fa-eye');
                btn.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                btn.classList.remove('fa-eye-slash');
                btn.classList.add('fa-eye');
            }
        });
    });

    usernameInput.addEventListener('input', function () {
        clearError();
        usernameInput.closest('.input-wrapper').classList.remove('error');
    });

    passwordInput.addEventListener('input', function () {
        clearError();
        passwordInput.closest('.input-wrapper').classList.remove('error');
    });

  form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearError();

        // Mode test : connexion directe sans vérification des identifiants
        var username = usernameInput.value.trim();
        var user = findUser(username, passwordInput.value) || USERS[0];

        btnLogin.classList.add('loading');

        setTimeout(function () {
            showSuccess('Connexion réussie ! Redirection en cours...');
            btnLogin.classList.remove('loading');
            localStorage.setItem('archicoud_session', '1');
            setTimeout(function () {
                window.location.href = user.redirect;
            }, 1000);
        }, 500);
    });

    function findUser(username, password) {
        for (var i = 0; i < USERS.length; i++) {
            if (USERS[i].username === username && USERS[i].password === password) {
                return USERS[i];
            }
        }
        return null;
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorBox.classList.add('visible');
        successBox.classList.remove('visible');
    }

    function showSuccess(message) {
        successBox.classList.add('visible');
        errorBox.classList.remove('visible');
    }

    function clearError() {
        errorBox.classList.remove('visible');
    }

})();