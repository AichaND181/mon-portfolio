// utils.js - Fonctions utilitaires partagées

/**
 * Affiche un toast (notification) en bas à droite
 * @param {string} message - Le message à afficher
 * @param {string} type - 'success', 'error', 'warning'
 */
function showToast(message, type) {
    // Supprimer un toast existant pour éviter les doublons
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-circle-exclamation',
        warning: 'fas fa-triangle-exclamation'
    };
    var colors = {
        success: '#15803d',
        error: '#b91c1c',
        warning: '#ca8a04'
    };

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="' + (icons[type] || icons.success) + '" style="color:' + (colors[type] || colors.success) + '"></i> ' + message + '<div class="toast-progress" style="background:' + (colors[type] || colors.success) + '"></div>';
    document.body.appendChild(toast);

    // Disparition automatique après 3 secondes
    setTimeout(function () {
        toast.classList.add('toast-out');
        setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
}

/**
 * Récupère les préférences de notifications depuis localStorage
 * @returns {object} Les préférences (avec des valeurs par défaut)
 */
function getNotificationPreferences() {
    var defaults = {
        ajout: true,
        modification: true,
        suppression: true,
        connexion: false,
        hebdomadaire: true
    };
    try {
        var saved = localStorage.getItem('archicoud_notifications');
        if (saved) {
            var parsed = JSON.parse(saved);
            // Fusionner avec les valeurs par défaut pour les clés manquantes
            for (var key in defaults) {
                if (!(key in parsed)) parsed[key] = defaults[key];
            }
            return parsed;
        }
    } catch (e) { /* ignore */ }
    return defaults;
}

/**
 * Vérifie si une notification est activée pour un type donné
 * @param {string} type - 'ajout', 'modification', 'suppression', etc.
 * @returns {boolean} true si la notification est activée
 */
function isNotificationEnabled(type) {
    var prefs = getNotificationPreferences();
    return prefs[type] !== false; // si la clé est absente, on considère true
}