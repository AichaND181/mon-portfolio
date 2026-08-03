/* ================================================================
   ARCHI-COUD — Collecte JavaScript
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Collecte.js chargé');
    
    const formulaireCollecte = document.getElementById('formulaire-collecte');
    const messageFormulaire = document.getElementById('message-formulaire');
    
    // Étapes du stepper
    const etapesStepper = document.querySelectorAll('.etape-stepper');
    console.log('Étapes stepper trouvées:', etapesStepper.length);
    
    // Contenus des étapes
    const etape1Collecte = document.getElementById('etape-1-collecte');
    const etape2Classement = document.getElementById('etape-2-classement');
    const etape3Conservation = document.getElementById('etape-3-conservation');
    const etape4Communication = document.getElementById('etape-4-communication');
    
    // Boutons de navigation
    const boutonSuivant1 = document.getElementById('bouton-suivant-1');
    const boutonPrecedent2 = document.getElementById('bouton-precedent-2');
    const boutonSuivant2 = document.getElementById('bouton-suivant-2');
    const boutonPrecedent3 = document.getElementById('bouton-precedent-3');
    const boutonSuivant3 = document.getElementById('bouton-suivant-3');
    const boutonPrecedent4 = document.getElementById('bouton-precedent-4');
    
    let etapeCourante = 1; // 1 = Collecte, 2 = Classement, 3 = Conservation, 4 = Communication
    
    // Fonction pour mettre à jour l'affichage du stepper
    function mettreAJourStepper(numeroEtape) {
        etapesStepper.forEach((etape, index) => {
            if (index + 1 <= numeroEtape) {
                etape.classList.remove('desactivee');
                etape.classList.add('active');
            } else {
                etape.classList.remove('active');
                etape.classList.add('desactivee');
            }
        });
    }
    
    // Fonction pour afficher l'étape correspondante
    function afficherEtape(numeroEtape) {
        etape1Collecte.style.display = numeroEtape === 1 ? 'block' : 'none';
        etape2Classement.style.display = numeroEtape === 2 ? 'block' : 'none';
        etape3Conservation.style.display = numeroEtape === 3 ? 'block' : 'none';
        etape4Communication.style.display = numeroEtape === 4 ? 'block' : 'none';
    }
    
    // Bouton Suivant 1 (Collecte → Classement)
    if (boutonSuivant1) {
        boutonSuivant1.addEventListener('click', function() {
            const departement = document.getElementById('departement-collecte');
            const type = document.getElementById('type-collecte');
            const date = document.getElementById('date-reception-collecte');
            
            if (!departement || !departement.value || !type || !type.value || !date || !date.value) {
                afficherMessage('Veuillez remplir tous les champs obligatoires (*) avant de passer au classement.', 'erreur');
                return;
            }
            
            etapeCourante = 2;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            afficherMessage('Collecte terminée. Passons au classement.', 'succes');
        });
    }
    
    // Bouton Précédent 2 (Classement → Collecte)
    if (boutonPrecedent2) {
        boutonPrecedent2.addEventListener('click', function() {
            etapeCourante = 1;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Bouton Suivant 2 (Classement → Conservation)
    if (boutonSuivant2) {
        boutonSuivant2.addEventListener('click', function() {
            const categorie = document.getElementById('categorie-classement');
            const code = document.getElementById('code-classement');
            
            if (!categorie || !categorie.value || !code || !code.value) {
                afficherMessage('Veuillez remplir tous les champs obligatoires (*) avant de passer à la conservation.', 'erreur');
                return;
            }
            
            etapeCourante = 3;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            afficherMessage('Classement terminé. Passons à la conservation.', 'succes');
        });
    }
    
    // Bouton Précédent 3 (Conservation → Classement)
    if (boutonPrecedent3) {
        boutonPrecedent3.addEventListener('click', function() {
            etapeCourante = 2;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Bouton Suivant 3 (Conservation → Communication)
    if (boutonSuivant3) {
        boutonSuivant3.addEventListener('click', function() {
            const duree = document.getElementById('duree-conservation');
            const support = document.getElementById('support-conservation');
            
            if (!duree || !duree.value || !support || !support.value) {
                afficherMessage('Veuillez remplir tous les champs obligatoires (*) avant de passer à la communication.', 'erreur');
                return;
            }
            
            etapeCourante = 4;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            afficherMessage('Conservation définie. Passons à la communication.', 'succes');
        });
    }
    
    // Bouton Précédent 4 (Communication → Conservation)
    if (boutonPrecedent4) {
        boutonPrecedent4.addEventListener('click', function() {
            etapeCourante = 3;
            mettreAJourStepper(etapeCourante);
            afficherEtape(etapeCourante);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Soumission du formulaire
    if (formulaireCollecte) {
        formulaireCollecte.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Valider tous les champs obligatoires
            const accessibilite = document.getElementById('accessibilite');
            
            if (!accessibilite || !accessibilite.value) {
                afficherMessage('Veuillez remplir tous les champs obligatoires (*).', 'erreur');
                return;
            }
            
            // Simuler l'enregistrement
            afficherMessage('Document enregistré avec succès ! Redirection...', 'succes');
            
            // Redirection après 2 secondes
            setTimeout(() => {
                window.location.href = 'documents.html';
            }, 2000);
        });
    }
    
    // Fonction pour afficher un message
    function afficherMessage(texte, type) {
        if (messageFormulaire) {
            messageFormulaire.textContent = texte;
            messageFormulaire.className = 'message-formulaire ' + type;
            messageFormulaire.style.display = 'block';
        }
    }
});
