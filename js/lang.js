// ============================================
//   YAKEEN INTERNATIONAL — LANGUAGE SWITCHER
//   Uses Google Translate widget (free, no API key needed)
// ============================================

// All supported languages
const LANGUAGES = {
  en: { code: 'en', label: 'EN',  name: 'English', dir: 'ltr' },
  bn: { code: 'bn', label: 'বাং', name: 'Bangla',  dir: 'ltr' },
  hi: { code: 'hi', label: 'हिं', name: 'Hindi',   dir: 'ltr' },
  ar: { code: 'ar', label: 'عر',  name: 'Arabic',  dir: 'rtl' },
};

// ── Inject Google Translate script once ──
(function injectGoogleTranslate() {
  if (document.getElementById('google-translate-script')) return;

  // Hidden Google Translate element
  const div = document.createElement('div');
  div.id = 'google_translate_element';
  div.style.display = 'none';
  document.body.appendChild(div);

  // Define init callback
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,bn,hi,ar',
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  // Load Google Translate script
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
})();


// ── Switch language function (called by buttons) ──
window.switchLang = function (langCode) {
  const lang = LANGUAGES[langCode];
  if (!lang) return;

  // Update active button state on ALL lang switchers on the page
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('onclick') === `switchLang('${langCode}')`) {
      btn.classList.add('active');
    }
  });

  // Set page direction for Arabic
  document.documentElement.setAttribute('dir', lang.dir);
  document.documentElement.setAttribute('lang', lang.code);

  // Save preference
  localStorage.setItem('yakeen_lang', langCode);

  // Use Google Translate cookie method
  if (langCode === 'en') {
    // Reset to English — remove translation cookie
    resetToEnglish();
    return;
  }

  // Trigger Google Translate
  triggerGoogleTranslate(lang.code);
};


// ── Trigger Google Translate programmatically ──
function triggerGoogleTranslate(langCode) {
  // Wait for Google Translate to be ready
  const tryTranslate = setInterval(() => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      clearInterval(tryTranslate);
    }
  }, 200);

  // Timeout after 5 seconds
  setTimeout(() => clearInterval(tryTranslate), 5000);
}


// ── Reset to English ──
function resetToEnglish() {
  // Remove Google Translate cookies
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;

  // Reload page to reset
  window.location.reload();
}


// ── Restore saved language on page load ──
(function restoreLang() {
  const saved = localStorage.getItem('yakeen_lang');
  if (saved && saved !== 'en') {
    // Small delay to let page fully load first
    setTimeout(() => {
      window.switchLang(saved);
    }, 800);
  }

  // Set active button
  const activeLang = saved || 'en';
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick') === `switchLang('${activeLang}')`) {
        btn.classList.add('active');
      }
    });
  });
})();


// ── Hide Google Translate toolbar (keeps our custom UI) ──
const style = document.createElement('style');
style.textContent = `
  .goog-te-banner-frame,
  .goog-te-balloon-frame,
  #goog-gt-tt,
  .goog-te-spinner-pos { display: none !important; }
  body { top: 0 !important; }
  .skiptranslate { display: none !important; }
`;
document.head.appendChild(style);
