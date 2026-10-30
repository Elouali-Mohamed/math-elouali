document.addEventListener("DOMContentLoaded", () => {
  function renderSpecialDocumentList(containerId, documents, kind) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const isArabic = document.documentElement.lang === "ar";
    const emptyText = isArabic ? "لا توجد ملفات مضافة في هذا القسم حالياً." : "Aucun document ajouté dans cette rubrique pour le moment.";
    const openText = isArabic ? "فتح ملف PDF ↗" : "Ouvrir le PDF ↗";
    const safeDocs = Array.isArray(documents) ? documents.filter(doc => doc && doc.title && doc.url && /^https?:\/\//i.test(doc.url)) : [];
    if (!safeDocs.length) {
      container.innerHTML = `<div class="special-empty"><span aria-hidden="true">📄</span><p>${emptyText}</p></div>`;
      return;
    }
    container.innerHTML = safeDocs.map(doc => {
      const title = String(doc.title).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
      const level = doc.level ? String(doc.level).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])) : (isArabic ? "جميع المستويات" : "Tous les niveaux");
      const url = String(doc.url).replace(/"/g, "%22");
      return `<article class="special-document-card"><span class="special-document-icon" aria-hidden="true">📄</span><div class="special-document-content"><h3>${title}</h3><p>${level}</p><a href="${url}" target="_blank" rel="noopener noreferrer">${openText}</a></div></article>`;
    }).join("");
  }
  function renderSpecialSections() {
    renderSpecialDocumentList("memorandums-list", window.MINISTERIAL_MEMORANDUMS, "memorandums");
    renderSpecialDocumentList("distributions-list", window.ANNUAL_DISTRIBUTIONS, "distributions");
    renderSpecialDocumentList("fichiers-pedagogiques-list", window.PEDAGOGICAL_FILES, "pedagogical");
  }
  renderSpecialSections();
  const searchInput = document.getElementById("search-input");
  const levelFilter = document.getElementById("level-filter");
  const typeFilter = document.getElementById("type-filter");
  const resourceGrid = document.getElementById("resource-grid");
  const emptyState = document.getElementById("empty-state");
  const cycleGrid = document.getElementById("cycle-grid");
  const sublevelPanel = document.getElementById("sublevel-panel");
  const sublevelGrid = document.getElementById("sublevel-grid");
  const levelDetailPanel = document.getElementById("level-detail-panel");
  const formatDetailPanel = document.getElementById("format-detail-panel");
  const backToCycles = document.getElementById("back-to-cycles");
  const backToLevels = document.getElementById("back-to-levels");
  const backToCategories = document.getElementById("back-to-categories");
  let selectedCycle = "";
  let selectedLevel = "";
  let selectedCategory = "";
  let selectedFormat = "";
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  const contactLink = document.getElementById("contact-link");
  let currentLang = "fr";

  const text = {
    fr: {
      skip:"Aller au contenu", home:"Accueil", levelsNav:"Niveaux", resourcesNav:"Ressources", aboutNav:"À propos", contactNav:"Contact",
      eyebrow:"PLATEFORME ÉDUCATIVE • MAROC", title:'Les mathématiques deviennent <span>plus simples.</span>',
      heroDesc:"Retrouvez ici vos cours, exercices, devoirs et examens de mathématiques, du primaire au lycée.", explore:"Explorer les niveaux", seeResources:"Voir les ressources", heroNote:"Des ressources pour apprendre, pratiquer et progresser.",
      learning:"APPRENDRE À SON RYTHME", chooseLevel:"Choisissez votre cycle", levelIntro:"Choisissez Primaire, Collège ou Lycée, puis sélectionnez votre niveau scolaire.",
      primary:"Primaire", college:"Collège", high:"Lycée", primaryDesc:"De la 1re à la 6e année primaire.", collegeDesc:"1AC, 2AC et 3AC.", highDesc:"Tronc commun, 1ère Bac et 2ème Bac.", exploreResources:"Choisir un niveau ↗", backCycles:"← Tous les cycles", backLevels:"← Retour aux niveaux", levelSpaceEyebrow:"VOTRE ESPACE DE TRAVAIL", levelSpaceDescription:"Choisissez une catégorie pour consulter les documents.", exploreCategory:"Explorer ↗", courseDescription:"Leçons et résumés du programme.", exerciseDescription:"Entraînement et application.", homeworkDescription:"Devoirs surveillés et évaluations.", examDescription:"Examens régionaux et nationaux.", backCategories:"← Retour aux catégories", formatEyebrow:"CHOISIR UN FORMAT", formatDescription:"Choisissez les documents PDF ou les vidéos.", pdfLabel:"Documents PDF", videoLabel:"Vidéos", pdfDescription:"Fiches, cours et documents à consulter ou télécharger.", videoDescription:"Explications vidéo et leçons en images.", levelHeading:"NIVEAUX SCOLAIRES", levelDescription:"Sélectionnez votre niveau pour accéder aux ressources.", chooseSublevel:"Choisissez votre niveau", allCycleLevels:"Tous les niveaux",
      primaryLevels:[["1AEP","1ère année primaire"],["2AEP","2ème année primaire"],["3AEP","3ème année primaire"],["4AEP","4ème année primaire"],["5AEP","5ème année primaire"],["6AEP","6ème année primaire"]], collegeLevels:[["1AC","1ère année collège"],["2AC","2ème année collège"],["3AC","3ème année collège"]], lyceeLevels:[["TC","Tronc Commun Sciences"], ["TCL","Tronc Commun Lettres"], ["1BACSE","1BAC Sciences Expérimentales"], ["1BACSM","1BAC Sciences Mathématiques"], ["1BACL","1BAC Lettres"], ["2BACSVTPC","2BAC SVT et PC"], ["2BACL","2BAC Lettres"], ["2BACSM","2BAC Mathématiques"]],
      library:"BIBLIOTHÈQUE", pedagogic:"Bibliothèque de documents", libraryIntro:"Consultez les documents disponibles par niveau scolaire.",
      search:"Rechercher une ressource…", searchLabel:"Rechercher une ressource", allLevels:"Tous les niveaux", allTypes:"Toutes les catégories", courses:"Cours", summary:"Résumé", exercises:"Exercices", homework:"Devoirs", exams:"Examens", correction:"Correction", video:"Vidéo",
      emptyTitle:"Aucun document disponible pour cette sélection", emptyDesc:"Essayez un autre niveau ou une autre catégorie.", noResults:"Aucune ressource trouvée", noResultsDesc:"Essayez de modifier la recherche ou les filtres.",
      aboutEyebrow:"À PROPOS", aboutTitle:"Une bibliothèque de mathématiques pour tous.", aboutDesc:"Cette plateforme a pour objectif de rassembler des ressources de mathématiques adaptées aux élèves marocains, du primaire au lycée.",
      contactEyebrow:"RESTONS EN CONTACT", contactTitle:"Une question ou une suggestion ?", contactDesc:"Ajoutez ici votre page Facebook, votre adresse e-mail ou tout autre moyen de contact.", configure:"Configurer le contact", contactUs:"Nous contacter ↗", contactAlert:"Le lien de contact n’est pas encore configuré.",
      rights:"Tous droits réservés.", openResource:"Ouvrir la ressource ↗", watchVideo:"Voir la vidéo ↗", resource:"Ressource", untitled:"Sans titre", menu:"Ouvrir le menu"
    },
    ar: {
      skip:"انتقل إلى المحتوى", home:"الرئيسية", levelsNav:"المستويات", resourcesNav:"الموارد", aboutNav:"من نحن", contactNav:"اتصل بنا",
      eyebrow:"منصة تعليمية • المغرب", title:'الرياضيات تصبح <span>أكثر سهولة.</span>',
      heroDesc:"تجدون هنا دروس الرياضيات وتمارينها وفروضها وامتحاناتها، من التعليم الابتدائي إلى الثانوي.", explore:"اكتشف المستويات", seeResources:"تصفح الموارد", heroNote:"موارد تساعدك على التعلم والتدرب والتقدم.",
      learning:"تعلّم حسب وتيرتك", chooseLevel:"اختر السلك الدراسي", levelIntro:"اختر الابتدائي أو الإعدادي أو الثانوي التأهيلي، ثم اختر مستواك الدراسي.",
      primary:"التعليم الابتدائي", college:"التعليم الإعدادي", high:"الثانوي التأهيلي", primaryDesc:"من الأولى إلى السادسة ابتدائي.", collegeDesc:"الأولى والثانية والثالثة إعدادي.", highDesc:"الجذع المشترك والأولى والثانية باكالوريا.", exploreResources:"اختر المستوى ↗", backCycles:"← جميع الأسلاك", backLevels:"← العودة إلى المستويات", levelSpaceEyebrow:"فضاؤك الدراسي", levelSpaceDescription:"اختر قسماً للاطلاع على الموارد والوثائق.", exploreCategory:"تصفح ↗", courseDescription:"الدروس والملخصات المقررة.", exerciseDescription:"تمارين للتدرب والتطبيق.", homeworkDescription:"فروض محروسة وتقييمات.", examDescription:"امتحانات جهوية ووطنية.", backCategories:"← العودة إلى الأقسام", formatEyebrow:"اختر صيغة المورد", formatDescription:"اختر ملفات PDF أو الفيديوهات.", pdfLabel:"ملفات PDF", videoLabel:"فيديوهات", pdfDescription:"دروس ووثائق قابلة للفتح أو التحميل.", videoDescription:"شروحات مرئية ودروس بالفيديو.", levelHeading:"المستويات الدراسية", levelDescription:"اختر مستواك للوصول إلى الموارد التعليمية.", chooseSublevel:"اختر مستواك الدراسي", allCycleLevels:"جميع المستويات",
      primaryLevels:[["1AEP","السنة الأولى ابتدائي"],["2AEP","السنة الثانية ابتدائي"],["3AEP","السنة الثالثة ابتدائي"],["4AEP","السنة الرابعة ابتدائي"],["5AEP","السنة الخامسة ابتدائي"],["6AEP","السنة السادسة ابتدائي"]], collegeLevels:[["1AC","الأولى إعدادي"],["2AC","الثانية إعدادي"],["3AC","الثالثة إعدادي"]], lyceeLevels:[["TC","الجذع المشترك علوم"], ["TCL","الجذع المشترك آداب"], ["1BACSE","الأولى باكالوريا علوم تجريبية"], ["1BACSM","الأولى باكالوريا علوم رياضية"], ["1BACL","الأولى باكالوريا آداب"], ["2BACSVTPC","الثانية باكالوريا علوم الحياة والأرض والعلوم الفيزيائية"], ["2BACL","الثانية باكالوريا آداب"], ["2BACSM","الثانية باكالوريا علوم رياضية"]],
      library:"المكتبة", pedagogic:"مكتبة الوثائق", libraryIntro:"تصفح الوثائق المتاحة حسب المستوى الدراسي.",
      search:"ابحث عن مورد…", searchLabel:"البحث عن مورد", allLevels:"جميع المستويات", allTypes:"جميع الفئات", courses:"دروس", summary:"ملخصات", exercises:"تمارين", homework:"فروض", exams:"امتحانات", correction:"تصحيح", video:"فيديو",
      emptyTitle:"لا توجد وثائق متاحة لهذا الاختيار", emptyDesc:"جرّب مستوى دراسياً أو فئة أخرى.", noResults:"لم يتم العثور على موارد", noResultsDesc:"حاول تغيير كلمات البحث أو عوامل التصفية.",
      aboutEyebrow:"من نحن", aboutTitle:"مكتبة رياضيات للجميع.", aboutDesc:"تهدف هذه المنصة إلى جمع موارد الرياضيات الملائمة للتلاميذ المغاربة، من الابتدائي إلى الثانوي.",
      contactEyebrow:"ابقَ على تواصل", contactTitle:"هل لديك سؤال أو اقتراح؟", contactDesc:"أضف هنا رابط صفحتك على فيسبوك أو بريدك الإلكتروني أو أي وسيلة أخرى للتواصل.", configure:"إعداد رابط التواصل", contactUs:"اتصل بنا ↗", contactAlert:"لم يتم إعداد رابط التواصل بعد.",
      rights:"جميع الحقوق محفوظة.", openResource:"افتح المورد ↗", watchVideo:"شاهد الفيديو ↗", resource:"مورد", untitled:"بدون عنوان", menu:"فتح القائمة"
    }
  };

  document.getElementById("current-year").textContent = new Date().getFullYear();

  function setText(selector, value, html=false) {
    const el=document.querySelector(selector); if(el) html ? el.innerHTML=value : el.textContent=value;
  }
  function applyLanguage(lang) {
    currentLang = lang === "ar" ? "ar" : "fr";
    const t=text[currentLang];
    document.documentElement.lang=currentLang;
    document.documentElement.dir=currentLang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", currentLang === "ar");
    document.querySelectorAll("[data-fr][data-ar]").forEach(el => { el.textContent = el.dataset[currentLang]; });
    setText(".skip-link",t.skip);
    const navLinks=nav.querySelectorAll("a");
    [t.home,t.levelsNav,t.resourcesNav,t.aboutNav,t.contactNav].forEach((v,i)=>{if(navLinks[i])navLinks[i].textContent=v;});
    nav.setAttribute("aria-label",currentLang==="ar"?"التنقل الرئيسي":"Navigation principale");
    menuToggle.querySelector(".sr-only").textContent=t.menu;
    setText(".hero-copy .eyebrow",t.eyebrow);
    setText(".hero h1",t.title,true);
    setText(".hero-description",t.heroDesc);
    const heroButtons=document.querySelectorAll(".hero-actions a"); if(heroButtons[0])heroButtons[0].textContent=t.explore; if(heroButtons[1])heroButtons[1].textContent=t.seeResources;
    setText(".hero-note",t.heroNote);
    setText("#niveaux .eyebrow",t.learning);
    setText("#niveaux h2",t.chooseLevel);
    setText("#niveaux .section-heading > p:last-child",t.levelIntro);
    const cycleCards=cycleGrid.querySelectorAll(".cycle-card");
    const cycleLabels=[[t.primary,t.primaryDesc],[t.college,t.collegeDesc],[t.high,t.highDesc]];
    cycleCards.forEach((card,i)=>{if(cycleLabels[i]){card.querySelector("h3").textContent=cycleLabels[i][0];card.querySelector("p").textContent=cycleLabels[i][1];card.querySelector(".card-arrow").textContent=t.exploreResources;}});
    backToCycles.textContent=t.backCycles;
    backToLevels.textContent=t.backLevels;
    backToCategories.textContent=t.backCategories;
    document.getElementById("selected-category-eyebrow").textContent=t.formatEyebrow;
    document.getElementById("selected-category-description").textContent=t.formatDescription;
    document.querySelectorAll("[data-format-label]").forEach(el=>el.textContent=el.dataset.formatLabel==="pdf"?t.pdfLabel:t.videoLabel);
    document.querySelectorAll("[data-format-description]").forEach(el=>el.textContent=el.dataset.formatDescription==="pdf"?t.pdfDescription:t.videoDescription);
    document.querySelectorAll(".format-choice-card .card-arrow").forEach(el=>el.textContent=t.exploreCategory);
    document.getElementById("selected-cycle-eyebrow").textContent=t.levelHeading;
    document.getElementById("selected-level-eyebrow").textContent=t.levelSpaceEyebrow;
    document.getElementById("selected-level-description").textContent=t.levelSpaceDescription;
    document.querySelectorAll("[data-category-label]").forEach(el=>{
      const key=el.dataset.categoryLabel;
      el.textContent=key==="courses"?t.courses:key==="exercises"?t.exercises:key==="homework"?t.homework:t.exams;
    });
    document.querySelectorAll("[data-category-description]").forEach(el=>{
      const key=el.dataset.categoryDescription;
      el.textContent=key==="courses"?t.courseDescription:key==="exercises"?t.exerciseDescription:key==="homework"?t.homeworkDescription:t.examDescription;
    });
    document.querySelectorAll(".level-category-card .card-arrow").forEach(el=>el.textContent=t.exploreCategory);
    document.getElementById("selected-cycle-description").textContent=t.levelDescription;
    if(selectedCycle) { showSublevels(selectedCycle); if(selectedLevel) showLevelDetail(selectedLevel,""); }
    setText("#ressources .eyebrow",t.library);setText("#ressources h2",t.pedagogic);setText("#ressources .section-heading > p:last-child",t.libraryIntro,true);
    searchInput.placeholder=t.search;searchInput.setAttribute("aria-label",t.searchLabel);
    const levelOptions=levelFilter.options; levelOptions[0].textContent=t.allLevels;
    const optionLabels=Object.fromEntries([...t.primaryLevels,...t.collegeLevels,...t.lyceeLevels].map(([code,label])=>[code,label]));
    Array.from(levelOptions).slice(1).forEach(option=>{if(optionLabels[option.value])option.textContent=optionLabels[option.value];});
    const typeOptions=typeFilter.options; typeOptions[0].textContent=t.allTypes; [t.courses,t.summary,t.exercises,t.homework,t.exams,t.correction,t.video].forEach((v,i)=>{if(typeOptions[i+1])typeOptions[i+1].textContent=v;});
    setText("#empty-state h3",t.emptyTitle);setText("#empty-state p",t.emptyDesc,true);
    setText("#apropos .eyebrow",t.aboutEyebrow);setText("#apropos h2",t.aboutTitle);setText("#apropos .about-inner p:not(.eyebrow)",t.aboutDesc);
    setText("#contact .eyebrow",t.contactEyebrow);setText("#contact h2",t.contactTitle);setText("#contact .contact-inner p:not(.eyebrow)",t.contactDesc);
    setText(".footer-inner > p:last-child",`© ${new Date().getFullYear()} ${t.rights}`);
    if (SITE_CONFIG.contactUrl) contactLink.textContent=t.contactUs; else contactLink.textContent=t.configure;
    document.querySelectorAll(".lang-btn").forEach(btn=>{const active=btn.dataset.lang===currentLang;btn.classList.toggle("is-active",active);btn.setAttribute("aria-pressed",String(active));});
    renderResources();
    renderSpecialSections();
  }

  if (SITE_CONFIG.contactUrl) {
    contactLink.href = SITE_CONFIG.contactUrl; contactLink.target = "_blank"; contactLink.rel = "noopener noreferrer";
  } else {
    contactLink.addEventListener("click", event => { event.preventDefault(); alert(text[currentLang].contactAlert); });
  }
  menuToggle.addEventListener("click", () => {const isOpen=nav.classList.toggle("is-open");menuToggle.setAttribute("aria-expanded",String(isOpen));});
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("is-open");menuToggle.setAttribute("aria-expanded","false");}));
  document.querySelectorAll(".lang-btn").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang)));
  function showSublevels(cycle) {
    selectedCycle=cycle;
    const t=text[currentLang];
    const labels={primary:t.primary,college:t.college,lycee:t.high};
    const levels={primary:t.primaryLevels,college:t.collegeLevels,lycee:t.lyceeLevels}[cycle]||[];
    cycleGrid.hidden=true;
    sublevelPanel.hidden=false;
    document.getElementById("selected-cycle-title").textContent=labels[cycle]||t.chooseSublevel;
    document.getElementById("selected-cycle-eyebrow").textContent=t.levelHeading;
    document.getElementById("selected-cycle-description").textContent=t.levelDescription;
    sublevelGrid.replaceChildren();
    levels.forEach(([code,name],i)=>{
      const card=document.createElement("button");card.type="button";card.className="level-card sublevel-card";card.dataset.levelChoice=code;
      const icon=document.createElement("span");icon.className="level-icon";icon.textContent=cycle==="primary"?"✏️":cycle==="college"?"∑":"📘";
      const number=document.createElement("span");number.className="level-number";number.textContent=String(i+1).padStart(2,"0");
      const title=document.createElement("h3");title.textContent=code;
      const desc=document.createElement("p");desc.textContent=name;
      const action=document.createElement("span");action.className="card-arrow";action.textContent=t.exploreResources;
      card.append(icon,number,title,desc,action);card.addEventListener("click",()=>showLevelDetail(code,name));
      sublevelGrid.append(card);
    });
    sublevelGrid.hidden=false;
    levelDetailPanel.hidden=true;
    formatDetailPanel.hidden=true;
  }
  function showLevelDetail(code,name) {
    selectedLevel=code;
    selectedCategory="";
    selectedFormat="";
    formatDetailPanel.hidden=true;
    levelFilter.value=code;
    typeFilter.value="";
    searchInput.value="";
    sublevelGrid.hidden=true;
    levelDetailPanel.hidden=false;
    document.getElementById("selected-level-title").textContent=code;
    document.getElementById("selected-level-description").textContent=text[currentLang].levelSpaceDescription;
    if(selectedCategory){
      const activeCategory=document.querySelector(`[data-resource-category="${selectedCategory}"] h3`);
      document.getElementById("selected-category-title").textContent=activeCategory?activeCategory.textContent:selectedCategory;
    }
    document.getElementById("niveaux").scrollIntoView({behavior:"smooth",block:"start"});
  }
  document.querySelectorAll("[data-resource-category]").forEach(button=>button.addEventListener("click",()=>{
    selectedCategory=button.dataset.resourceCategory;
    selectedFormat="";
    document.getElementById("selected-category-title").textContent=button.querySelector("h3").textContent;
    levelDetailPanel.hidden=true;
    formatDetailPanel.hidden=false;
    document.getElementById("niveaux").scrollIntoView({behavior:"smooth",block:"start"});
  }));
  document.querySelectorAll("[data-resource-format]").forEach(button=>button.addEventListener("click",()=>{
    selectedFormat=button.dataset.resourceFormat;
    levelFilter.value=selectedLevel;
    typeFilter.value=selectedCategory;
    searchInput.value="";
    renderResources();
    document.getElementById("ressources").scrollIntoView({behavior:"smooth",block:"start"});
  }));
  backToCategories.addEventListener("click",()=>{
    formatDetailPanel.hidden=true;
    levelDetailPanel.hidden=false;
    document.getElementById("niveaux").scrollIntoView({behavior:"smooth",block:"start"});
  });
  backToLevels.addEventListener("click",()=>{
    selectedLevel="";selectedCategory="";selectedFormat="";
    formatDetailPanel.hidden=true;
    levelDetailPanel.hidden=true;
    sublevelGrid.hidden=false;
    document.getElementById("niveaux").scrollIntoView({behavior:"smooth",block:"start"});
  });
  cycleGrid.querySelectorAll("[data-cycle]").forEach(card=>card.addEventListener("click",()=>showSublevels(card.dataset.cycle)));
  document.querySelectorAll("[data-category-select]").forEach(link=>link.addEventListener("click",()=>showSublevels(link.dataset.categorySelect)));
  backToCycles.addEventListener("click",()=>{selectedCycle="";selectedLevel="";selectedCategory="";selectedFormat="";formatDetailPanel.hidden=true;levelDetailPanel.hidden=true;sublevelGrid.hidden=false;sublevelPanel.hidden=true;cycleGrid.hidden=false;document.getElementById("niveaux").scrollIntoView({behavior:"smooth"});});

  function renderResources() {
    const t=text[currentLang];
    const query=searchInput.value.trim().toLocaleLowerCase(currentLang==="ar"?"ar":"fr");
    const level=levelFilter.value; const type=typeFilter.value;
    const filtered=RESOURCES.filter(item=>{
      const category=item.category||item.type||"";
      const legacyVideo=item.type==="Vidéo"||item.type==="Video"||item.type==="فيديو";
      const format=item.format||(legacyVideo?"Vidéo":"PDF");
      const searchable=`${item.title||""} ${item.description||""} ${item.type||""} ${item.category||""} ${item.format||""}`.toLocaleLowerCase(currentLang==="ar"?"ar":"fr");
      return searchable.includes(query)&&(!level||item.level===level)&&(!type||category===type||((item.category||"")===type))&&(!selectedFormat||format===selectedFormat|| (selectedFormat==="Vidéo"&&legacyVideo));
    });
    resourceGrid.replaceChildren();
    filtered.forEach(item=>{
      const isVideo=item.format==="Vidéo"||item.type==="Vidéo"||item.type==="Video"||item.type==="فيديو";
      const card=item.url?document.createElement("a"):document.createElement("article");
      card.className="resource-card resource-link-card";
      if(item.url){card.href=item.url;card.target="_blank";card.rel="noopener noreferrer";card.setAttribute("aria-label",`${item.title||t.untitled} — ${isVideo?t.watchVideo:t.openResource}`);}
      const top=document.createElement("div");top.className="resource-card-top";
      const badge=document.createElement("span");badge.className="resource-type";badge.textContent=item.category||((isVideo)?t.video:(item.type||t.resource));
      const formatBadge=document.createElement("span");formatBadge.className="resource-format";formatBadge.textContent=item.format||(isVideo?t.video:"PDF");
      top.append(badge,formatBadge);
      const icon=document.createElement("span");icon.className="resource-document-icon";icon.textContent=isVideo?"▶":"PDF";
      const title=document.createElement("h3");title.textContent=item.title||t.untitled;
      const meta=document.createElement("p");meta.className="resource-meta";meta.textContent=[item.level,item.description].filter(Boolean).join(" · ");
      const action=document.createElement("span");action.className="resource-open";action.textContent=item.url?(isVideo?t.watchVideo:t.openResource):(currentLang==="ar"?"الرابط غير متوفر":"Lien non disponible");
      const arrow=document.createElement("span");arrow.className="resource-card-arrow";arrow.setAttribute("aria-hidden","true");arrow.textContent=item.url?"↗":"—";
      card.append(top,icon,title,meta,action,arrow);
      if(!item.url)card.classList.add("resource-link-disabled");
      resourceGrid.append(card);
    });
    emptyState.hidden=filtered.length>0;
    if(RESOURCES.length>0&&filtered.length===0){emptyState.hidden=false;setText("#empty-state h3",t.noResults);setText("#empty-state p",t.noResultsDesc);}
    else {setText("#empty-state h3",t.emptyTitle);setText("#empty-state p",t.emptyDesc,true);}
  }
  searchInput.addEventListener("input",renderResources);levelFilter.addEventListener("change",renderResources);typeFilter.addEventListener("change",renderResources);
  applyLanguage("fr");
});
