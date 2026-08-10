function detectAndSetLang() {
  const savedLang = localStorage.getItem('zk_lang_choice');

  let targetLang;
  if (savedLang === 'fr' || savedLang === 'ar') {
    targetLang = savedLang; // choix manuel précédent prioritaire
  } else {
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    targetLang = browserLang.startsWith('ar') ? 'ar' : 'fr';
  }

  if (targetLang === 'ar') {
    document.body.classList.remove('lang-fr');
    document.body.classList.add('lang-ar');
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
    if (typeof updateSliderPosition === 'function') updateSliderPosition();
  }
  // si targetLang === 'fr', on ne fait rien, le HTML démarre déjà en FR
}
detectAndSetLang();
