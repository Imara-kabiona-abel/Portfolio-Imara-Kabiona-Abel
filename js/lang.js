document.addEventListener('DOMContentLoaded', ()=>{
  const radios = document.querySelectorAll('input[name="lang"]');
  function setLang(lang){
    document.documentElement.lang = (lang==='en') ? 'en' : 'fr';
    document.querySelectorAll('[data-fr]').forEach(el=>{
      const fr = el.getAttribute('data-fr');
      const en = el.getAttribute('data-en') || fr;
      el.textContent = (lang==='en') ? en : fr;
    });
  }
  radios.forEach(r=> r.addEventListener('change', ()=> setLang(r.value)));
  // initialize
  setLang(document.querySelector('input[name="lang"]:checked').value);
});