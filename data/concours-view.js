
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("concours-enseignement-list");
  const categoriesPanel = document.getElementById("special-categories-panel");
  const resultsPanel = document.getElementById("special-results-panel");
  const backButton = document.getElementById("back-to-special-categories");

  if (!list || !categoriesPanel || !resultsPanel) return;

  const CATEGORY = "concours";
const HASH = "#special=concours";
  const isArabic = () => document.documentElement.lang === "ar";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function renderConcours() {
    const documents = window.CONCOURS_ENSEIGNEMENT || [];

    if (!documents.length) {
      list.innerHTML = `<p>${
        isArabic()
          ? "لا توجد ملفات مضافة في هذا القسم حالياً."
          : "Aucun document ajouté dans cette rubrique pour le moment."
      }</p>`;
      return;
    }

    list.innerHTML = documents.map(doc => {
      const title = escapeHTML(doc.title);
      const level = escapeHTML(doc.level || "");
      const url = escapeHTML(doc.url || "");

      return `
        <article class="special-document-card">
          <h3>📄 ${title}</h3>
          ${level ? `<p>${level}</p>` : ""}
          ${url
            ? `<a href="${url}" target="_blank" rel="noopener noreferrer">
                ${isArabic() ? "فتح الوثيقة" : "Ouvrir le document"}
              </a>`
            : ""}
        </article>
      `;
    }).join("");
  }

  function showConcours(updateHistory = true) {
    categoriesPanel.hidden = true;
    resultsPanel.hidden = false;

    document.querySelectorAll(
      "#special-results-panel [id$='-list']"
    ).forEach(element => {
      element.hidden = element !== list;
    });

    resultsPanel.dataset.activeCategory = CATEGORY;

    const title = document.getElementById("special-selected-title");
    const description = document.getElementById("special-selected-description");
    const eyebrow = document.getElementById("special-selected-eyebrow");

    if (title) title.textContent = isArabic()
      ? "مباريات التعليم"
      : "Concours de l’enseignement";

    if (description) description.textContent = isArabic()
      ? "موارد ووثائق مباريات ولوج أطر التدريس."
      : "Ressources et documents des concours de recrutement des enseignants.";

    if (eyebrow) eyebrow.textContent = isArabic()
      ? "مباريات التعليم"
      : "CONCOURS DE L’ENSEIGNEMENT";

    if (backButton) backButton.textContent = isArabic()
      ? "العودة إلى الأقسام"
      : "Retour aux rubriques";

    renderConcours();

    if (updateHistory && location.hash !== HASH) {
      history.pushState({ specialCategory: CATEGORY }, "", HASH);
    }
  }

  function hideConcours() {
    if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

    categoriesPanel.hidden = false;
    resultsPanel.hidden = true;
    delete resultsPanel.dataset.activeCategory;
  }

  document
    .querySelectorAll('[data-special-category="concours"]')
    .forEach(button => {
      button.addEventListener("click", () => showConcours(true));
    });

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

      if (history.state?.specialCategory === CATEGORY) {
        history.back();
      } else {
        hideConcours();
        history.pushState({}, "", "#niveaux");
      }
    });
  }

  window.addEventListener("popstate", () => {
    if (location.hash === HASH) {
      showConcours(false);
    } else {
      hideConcours();
    }
  });

  window.addEventListener("site-language-changed", () => {
    if (resultsPanel.dataset.activeCategory === CATEGORY) {
      showConcours(false);
    }
  });

  // فتح القسم مباشرة عند الدخول إلى رابطه
  if (location.hash === HASH) {
    showConcours(false);
  }
});
