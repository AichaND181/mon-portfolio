/**
 * ================================================================
 *  PAGE RECHERCHE AVANCÉE (recherche.html)
 * ================================================================
 *  Combine tous les critères pour filtrer DOCUMENTS
 *  (voir assets/js/documents.js) :
 *  - Mots-clés (titre + description)
 *  - Type de document
 *  - Département
 *  - Date de début / Date de fin (sur la date de création)
 *  - Statut
 *  - Code document
 * ================================================================
 */

function construireLigneResultat(doc) {
  return `
    <li>
      <span>
        <span class="code-document">${doc.code}</span>
        <span class="titre-document">${doc.titre}</span>
      </span>
      <span style="display: flex; gap: 8px; align-items: center;">
        <span class="badge-service">${doc.departement}</span>
        <span class="badge-statut ${doc.statut}">${libelleStatut(doc.statut)}</span>
      </span>
    </li>
  `;
}

function afficherResultatsRecherche(resultats) {
  const liste = document.getElementById("liste-resultats-recherche");
  const messageAucunResultat = document.getElementById("message-aucun-resultat-recherche");
  const titre = document.getElementById("titre-resultats");

  titre.textContent = `📋 Résultats de la recherche (${resultats.length} document${resultats.length > 1 ? "s" : ""} trouvé${resultats.length > 1 ? "s" : ""})`;

  if (resultats.length === 0) {
    liste.innerHTML = "";
    messageAucunResultat.style.display = "block";
  } else {
    liste.innerHTML = resultats.map(construireLigneResultat).join("");
    messageAucunResultat.style.display = "none";
  }
}

function lancerRecherche() {
  const motsCles = document.getElementById("recherche-mots-cles").value.trim().toLowerCase();
  const type = document.getElementById("recherche-type").value;
  const departement = document.getElementById("recherche-departement").value;
  const dateDebut = document.getElementById("recherche-date-debut").value;
  const dateFin = document.getElementById("recherche-date-fin").value;
  const statut = document.getElementById("recherche-statut").value;
  const code = document.getElementById("recherche-code").value.trim().toLowerCase();

  const resultats = DOCUMENTS.filter((doc) => {
    const correspondMotsCles =
      motsCles === "" ||
      doc.titre.toLowerCase().includes(motsCles) ||
      (doc.description || "").toLowerCase().includes(motsCles);

    const correspondType = type === "" || doc.type === type;
    const correspondDepartement = departement === "" || doc.departement === departement;
    const correspondStatut = statut === "" || doc.statut === statut;
    const correspondCode = code === "" || doc.code.toLowerCase().includes(code);

    const correspondDateDebut = dateDebut === "" || doc.dateCreation >= dateDebut;
    const correspondDateFin = dateFin === "" || doc.dateCreation <= dateFin;

    return (
      correspondMotsCles &&
      correspondType &&
      correspondDepartement &&
      correspondStatut &&
      correspondCode &&
      correspondDateDebut &&
      correspondDateFin
    );
  });

  afficherResultatsRecherche(resultats);
}

function reinitialiserRecherche() {
  document.getElementById("recherche-mots-cles").value = "";
  document.getElementById("recherche-type").value = "";
  document.getElementById("recherche-departement").value = "";
  document.getElementById("recherche-date-debut").value = "";
  document.getElementById("recherche-date-fin").value = "";
  document.getElementById("recherche-statut").value = "";
  document.getElementById("recherche-code").value = "";
  afficherResultatsRecherche(DOCUMENTS);
}

document.addEventListener("DOMContentLoaded", () => {
  const listeResultats = document.getElementById("liste-resultats-recherche");
  if (!listeResultats) return; // Ce script ne s'exécute que sur recherche.html

  // Affiche tous les documents par défaut au chargement de la page
  afficherResultatsRecherche(DOCUMENTS);

  document.getElementById("bouton-rechercher").addEventListener("click", lancerRecherche);
  document.getElementById("bouton-reinitialiser-recherche").addEventListener("click", reinitialiserRecherche);
});