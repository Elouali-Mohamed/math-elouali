
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("examens-professionnels-list");
  const categoriesPanel = document.getElementById("special-categories-panel");
  const resultsPanel = document.getElementById("special-results-panel");
  const backButton = document.getElementById("back-to-special-categories");

  if (!list || !categoriesPanel || !resultsPanel) return;

  const CATEGORY = "professional";
const HASH = "#special=professional";
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

  function renderProfessionalExams() {
    const documents = window.EXAMENS_PROFESSIONNELS || [];

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

  function showProfessionalExams(updateHistory = true) {
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
      ? "الامتحانات المهنية"
      : "Examens professionnels";

    if (description) description.textContent = isArabic()
      ? "موارد ووثائق الاستعداد للامتحانات المهنية."
      : "Ressources et documents de préparation aux examens professionnels.";

    if (eyebrow) eyebrow.textContent = isArabic()
      ? "الامتحانات المهنية"
      : "EXAMENS PROFESSIONNELS";

    if (backButton) backButton.textContent = isArabic()
      ? "العودة إلى الأقسام"
      : "Retour aux rubriques";

    renderProfessionalExams();

    if (updateHistory && location.hash !== HASH) {
      history.pushState({ specialCategory: CATEGORY }, "", HASH);
    }
  }

  function hideProfessionalExams() {
    if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

    categoriesPanel.hidden = false;
    resultsPanel.hidden = true;
    delete resultsPanel.dataset.activeCategory;
  }

  document
    .querySelectorAll('[data-special-category="professional"]')
    .forEach(button => {
      button.addEventListener("click", () => showProfessionalExams(true));
    });

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

      if (history.state?.specialCategory === CATEGORY) {
        history.back();
      } else {
        hideProfessionalExams();
        history.pushState({}, "", "#niveaux");
      }
    });
  }

  window.addEventListener("popstate", () => {
    if (location.hash === HASH) {
      showProfessionalExams(false);
    } else {
      hideProfessionalExams();
    }
  });

  window.addEventListener("site-language-changed", () => {
    if (resultsPanel.dataset.activeCategory === CATEGORY) {
      showProfessionalExams(false);
    }
  });

  // فتح القسم مباشرة عند الدخول إلى رابطه
  if (location.hash === HASH) {
    showProfessionalExams(false);
  }
});
