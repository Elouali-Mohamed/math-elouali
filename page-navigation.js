
document.addEventListener("DOMContentLoaded", () => {

  const main = document.getElementById("main");

  if (!main) return;

  // الأقسام التي تشكل كل صفحة
  const pages = {
    accueil: ["accueil", "quick-links"],

    niveaux: ["niveaux", "ressources"],

    memorandums: ["memorandums"],

    distributions: ["distributions"],

    pedagogical: ["fichiers-pedagogiques"],

    apropos: ["apropos", "contact"]
  };

  function showPage(page, scroll = true) {

    if (!pages[page]) page = "accueil";

    // إخفاء جميع محتويات الصفحة الرئيسية
    Array.from(main.children).forEach(section => {
      section.classList.add("page-section-hidden");
    });

    // إظهار القسم المختار فقط
    pages[page].forEach(id => {
      const section = document.getElementById(id);

      if (section) {
        section.classList.remove("page-section-hidden");
      }
    });

    // حفظ الصفحة في الرابط
    const url = new URL(window.location.href);
    url.searchParams.set("page", page);

    history.pushState(
      { page },
      "",
      url.pathname + url.search + url.hash
    );

    if (scroll) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  // الصفحة عند فتح الموقع
  function restorePage() {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || "accueil";

    if (!pages[page]) {
      showPage("accueil", false);
      return;
    }

    Array.from(main.children).forEach(section => {
      section.classList.add("page-section-hidden");
    });

    pages[page].forEach(id => {
      const section = document.getElementById(id);

      if (section) {
        section.classList.remove("page-section-hidden");
      }
    });
  }

  // التنقل بين الصفحات
  document.addEventListener("click", event => {

    const link = event.target.closest("a[href^='#']");

    if (!link) return;

    const target = link.getAttribute("href");

    const routes = {
      "#accueil": "accueil",
      "#niveaux": "niveaux",
      "#ressources": "niveaux",
      "#memorandums": "memorandums",
      "#distributions": "distributions",
      "#fichiers-pedagogiques": "pedagogical",
      "#apropos": "apropos",
      "#contact": "apropos"
    };

    const page = routes[target];

    if (!page) return;

    event.preventDefault();

    showPage(page);

    // إغلاق قائمة الهاتف
    const nav = document.getElementById("main-nav");
    const menu = document.getElementById("menu-toggle");

    if (nav) nav.classList.remove("is-open");
    if (menu) menu.setAttribute("aria-expanded", "false");
  });

  // الرجوع والتقدم في المتصفح
  window.addEventListener("popstate", restorePage);

  restorePage();

});
