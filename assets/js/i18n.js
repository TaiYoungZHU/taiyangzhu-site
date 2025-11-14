(function(){
const resources = {
  en: {
    name: "Taiyang Zhu",
    title: "PhD Student in Finance",
    hero_summary: "Research on asset pricing, machine learning and fintech.",
    view_pubs: "View publications →",
    latest_post: "Latest Blog",
    see_blog: "See all posts →",
    research: "Research",
    research_summary: "Short description or bullets...",
    nav_publications: "Publications",
    nav_blog: "Blog"
  },
  zh: {
    name: "朱太阳",
    title: "金融学博士生",
    hero_summary: "研究方向：资产定价、机器学习与金融科技。",
    view_pubs: "查看论文 →",
    latest_post: "最新博客",
    see_blog: "查看所有文章 →",
    research: "研究",
    research_summary: "一句话介绍你的研究方向",
    nav_publications: "论文",
    nav_blog: "博客"
  }
};

function getLangFromURL(){
  const p = new URLSearchParams(window.location.search);
  return p.get('lang') || localStorage.getItem('site_lang') || 'en';
}
function apply(doc, lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(resources[lang] && resources[lang][k]) el.textContent = resources[lang][k];
  });
}
function setLang(lang){
  localStorage.setItem('site_lang', lang);
  apply(document, lang);
}
document.addEventListener('DOMContentLoaded', ()=>{ const lang = getLangFromURL(); apply(document, lang);
  const btn = document.getElementById('langbtn');
  if(btn) btn.addEventListener('click', ()=>{ const newLang = (localStorage.getItem('site_lang')||'en')==='en'?'zh':'en'; setLang(newLang); location.search = '?lang='+newLang; });
});
window.setLang = setLang;
})();