(function(){
  const dict = {
    index: {
      de: {
        tagline: "Schnell klären, ob eine Betriebsanlagengenehmigung nötig ist",
        cta1: "Schnell‑Check starten",
        cta2: "Infos zum Verfahren",
        foot: "© {year} – Minimaler Genehmigungs‑Check (ohne Gewähr)",
        hero: "Betriebsanlagengenehmigung – brauche ich eine?",
        lead: "Eine schlanke Seite, um erste Anhaltspunkte zu bekommen. Kein Ersatz für Rechtsberatung."
      },
      en: {
        tagline: "Quickly assess if an operating permit is required",
        cta1: "Start quick check",
        cta2: "About the process",
        foot: "© {year} – Minimal permit check (no warranty)",
        hero: "Operating permit – do I need one?",
        lead: "A lightweight page to get first indications. Not a substitute for legal advice."
      }
    },
    check: {
      de: {
        title: "Schnell‑Check",
        intro: "Hake an, was auf deinen Betrieb zutrifft. Ergebnis erscheint unten.",
        q1: "Verwendest du Maschinen/Anlagen, die Lärm, Gerüche, Staub oder Erschütterungen verursachen könnten?",
        q2: "Werden Gefahrstoffe, leicht entzündliche Stoffe oder große Lagermengen aufbewahrt?",
        q3: "Ist mit erhöhtem Kunden‑/Lieferverkehr oder Nachtbetrieb zu rechnen?",
        q4: "Gastronomie, Werkstatt, Produktion oder ähnliche gewerbliche Nutzung?",
        note: "Hinweis: Dies ist nur eine grobe Einschätzung. Die Behörde kann per Feststellungsbescheid entscheiden.",
        likely: "Ergebnis: Wahrscheinlich genehmigungspflichtig.",
        maybe: "Ergebnis: Möglicherweise genehmigungspflichtig. Lass das prüfen.",
        unlikely: "Ergebnis: Eher nicht genehmigungspflichtig (bei kleinster Nutzung).",
        btnBack: "Zur Startseite"
      },
      en: {
        title: "Quick check",
        intro: "Tick what applies to your operation. Result shows below.",
        q1: "Do you use machines/equipment that may cause noise, odour, dust or vibration?",
        q2: "Do you store hazardous, flammable or large quantities of materials?",
        q3: "Is increased customer/delivery traffic or night operation expected?",
        q4: "Gastronomy, workshop, production or similar commercial use?",
        note: "Note: This is a rough indication only. The authority can decide case by case.",
        likely: "Result: Likely subject to permit.",
        maybe: "Result: Possibly subject to permit. Get it checked.",
        unlikely: "Result: Probably not subject to permit (for very small use).",
        btnBack: "Back to home"
      }
    },
    process: {
      de: {
        title: "Infos zum Verfahren (Kurz)",
        step1: "Zuständig: Bezirksamt Wien (mit Fachstellen).",
        step2: "Unterlagen: Lageplan/Grundriss, Beschreibung der Nutzung, Emissionen, Brandschutz, ggf. Nachweise.",
        step3: "Ablauf: Antrag → Prüfung → evtl. Auflagen → Bescheid.",
        step4: "Änderungen der Anlage können erneut genehmigungspflichtig sein.",
        back: "Zur Startseite"
      },
      en: {
        title: "About the process (short)",
        step1: "Authority: District office Vienna (with technical units).",
        step2: "Docs: layout plans, use description, emissions, fire safety, supporting documents.",
        step3: "Flow: application → review → possible conditions → decision.",
        step4: "Changes to the installation may require approval again.",
        back: "Back to home"
      }
    },
    common: {
      de: { imp: "Impressum", priv: "Datenschutz", lang: "Sprache" },
      en: { imp: "Imprint",   priv: "Privacy",    lang: "Language" }
    }
  };

  function getLang(){
    const u = localStorage.getItem('lang');
    if(u) return u;
    const nav = (navigator.language||'de').toLowerCase();
    return nav.startsWith('de') ? 'de' : 'en';
  }
  function setLang(l){
    localStorage.setItem('lang', l);
    render();
  }

  function t(scope, key){
    const lang = getLang();
    const s = dict[scope] && dict[scope][lang];
    return (s && s[key]) || '';
  }

  function render(){
    const page = document.documentElement.dataset.page;
    const lang = getLang();
    const year = new Date().getFullYear();

    // Header UI
    const langSel = document.querySelector('#langSel');
    if(langSel){
      langSel.value = lang;
      langSel.onchange = e => setLang(e.target.value);
      document.querySelectorAll('[data-i18n-common]').forEach(el=>{
        const key = el.dataset.i18nCommon;
        el.textContent = dict.common[lang][key];
      });
    }

    if(page === 'index'){
      qs('#hero').textContent = t('index','hero');
      qs('#lead').textContent = t('index','lead');
      qs('#cta1').textContent = t('index','cta1');
      qs('#cta2').textContent = t('index','cta2');
      qs('#foot').textContent = t('index','foot').replace('{year}', year);
    }
    if(page === 'check'){
      qs('#title').textContent = t('check','title');
      qs('#intro').textContent = t('check','intro');
      label('q1', t('check','q1'));
      label('q2', t('check','q2'));
      label('q3', t('check','q3'));
      label('q4', t('check','q4'));
      qs('#note').textContent = t('check','note');
      qs('#back').textContent = t('check','btnBack');
      updateResult();
    }
    if(page === 'process'){
      qs('#title').textContent = t('process','title');
      qs('#s1').textContent = t('process','step1');
      qs('#s2').textContent = t('process','step2');
      qs('#s3').textContent = t('process','step3');
      qs('#s4').textContent = t('process','step4');
      qs('#back').textContent = t('process','back');
    }
  }

  function qs(sel){ return document.querySelector(sel); }
  function label(forId, text){
    const el = document.querySelector(`label[for="${forId}"]`);
    if(el) el.textContent = text;
  }

  function updateResult(){
    const lang = getLang();
    const checks = ['q1','q2','q3','q4'].map(id => qs('#'+id).checked);
    const score = checks.filter(Boolean).length;
    let msg;
    if(score >= 3) msg = t('check','likely');
    else if(score === 2 || score === 1) msg = t('check','maybe');
    else msg = t('check','unlikely');
    qs('#result').textContent = msg;
  }

  window.addEventListener('DOMContentLoaded', function(){
    render();
    // bind checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
      cb.addEventListener('change', updateResult);
    });
  });
})();
