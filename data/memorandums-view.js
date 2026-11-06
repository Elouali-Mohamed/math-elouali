
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("memorandums-list");
  const categoriesPanel = document.getElementById("special-categories-panel");
  const resultsPanel = document.getElementById("special-results-panel");
  const backButton = document.getElementById("back-to-special-categories");

  if (!list || !categoriesPanel || !resultsPanel) return;

  const CATEGORY = "memorandums";
const HASH = "#special=memorandums";
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

  function renderMemorandums() {
    const documents = window.MINISTERIAL_MEMORANDUMS || [];

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

  function showMemorandums(updateHistory = true) {
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
      ? "المذكرات الوزارية"
      : "Mémorandums ministériels";

    if (description) description.textContent = isArabic()
      ? "المذكرات والوثائق الوزارية الرسمية."
      : "Notes et documents ministériels officiels.";

    if (eyebrow) eyebrow.textContent = isArabic()
      ? "وثائق رسمية"
      : "DOCUMENTS OFFICIELS";

    if (backButton) backButton.textContent = isArabic()
      ? "العودة إلى الأقسام"
      : "Retour aux rubriques";

    renderMemorandums();

    if (updateHistory && location.hash !== HASH) {
      history.pushState({ specialCategory: CATEGORY }, "", HASH);
    }
  }

  function hideMemorandums() {
    if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

    categoriesPanel.hidden = false;
    resultsPanel.hidden = true;
    delete resultsPanel.dataset.activeCategory;
  }

  document
    .querySelectorAll('[data-special-category="memorandums"]')
    .forEach(button => {
      button.addEventListener("click", () => showMemorandums(true));
    });

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (resultsPanel.dataset.activeCategory !== CATEGORY) return;

      if (history.state?.specialCategory === CATEGORY) {
        history.back();
      } else {
        hideMemorandums();
        history.pushState({}, "", "#niveaux");
      }
    });
  }

  window.addEventListener("popstate", () => {
    if (location.hash === HASH) {
      showMemorandums(false);
    } else {
      hideMemorandums();
    }
  });

  window.addEventListener("site-language-changed", () => {
    if (resultsPanel.dataset.activeCategory === CATEGORY) {
      showMemorandums(false);
    }
  });

  // فتح القسم مباشرة عند الدخول إلى رابطه
  if (location.hash === HASH) {
    showMemorandums(false);
  }
});
