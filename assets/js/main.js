/* ==========================================================================
   main.js — landing mantiqi
   O'ZGARTIRISH KERAK BO'LGAN YAGONA JOY — quyidagi CONFIG.
   ========================================================================== */

const CONFIG = {
  // 1) Anketa tugagach o'tiladigan manzil (hozir: Telegram bot).
  videoUrl: "https://t.me/drUbaydullohAbdulatif_bot?start=1",

  // 2) Sarlavha va pastki paneldagi telefon raqami.
  phone: "+998 95 507 78 87",

  // 3) Videoni yangi tabda ochish (true) yoki shu tabda (false).
  openInNewTab: true,

  // 4) Ijtimoiy tarmoq sahifalari (header'dagi ikonkalar).
  social: {
    telegram: "https://t.me/drubaydulloh_implant/35",
    instagram: "https://www.instagram.com/dr.ubaydull0h/",
    youtube: "https://www.youtube.com/@DrUbaydulloh"
  },

  // 5) Kvize (anketa) javoblari shu Google Apps Script "Web app" manziliga
  //    yuboriladi — u yerdan Google Sheets'ga qator bo'lib tushadi.
  sheetsUrl: "https://script.google.com/macros/s/AKfycbxdVf7XKkQBqipFXbgj6p2H7_2AxxuNajOknCJIeE5YWiLkQlsV8P17siFbFH1i8Gve/exec"
};

/* -------------------------------------------------------------------------- */

/** Reklama kabinetlariga event yuboradi. Pixel/GA ulanmagan bo'lsa — jim o'tadi. */
function trackCta(place) {
  try {
    if (typeof fbq === 'function') fbq('track', 'ViewContent', { content_name: 'vsl_' + place });
    if (typeof gtag === 'function') gtag('event', 'cta_click', { cta_location: place });
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'cta_click', cta_location: place });
  } catch (e) { /* tracking hech qachon sahifani buzmasin */ }
}

/* ---------- 1. CTA tugmasini videoga bog'lash ----------
   MUHIM: .js-quiz-trigger tugmaga (teaser blok) haqiqiy videoUrl href
   sifatida QO'YILMAYDI — u avval kvize oynasini ochishi kerak. Agar cross-origin
   href tursa, ba'zi joylashtirilgan (embed) muhitlarda havola brauzer tomonidan
   JS ishlashidan oldin ushlab qolinib, kvizeni chetlab o'tib videoni ochib yuboradi.
   Faqat kvize oxiridagi "Videoni ko'rish" (#quizFinish) haqiqiy linkka ega bo'ladi. */
document.querySelectorAll('[data-cta]:not(.js-quiz-trigger)').forEach(function (el) {
  el.href = CONFIG.videoUrl;
  if (CONFIG.openInNewTab) {
    el.target = '_blank';
    el.rel = 'noopener';
  }
  el.addEventListener('click', function () { trackCta(el.dataset.cta); });
});

/* ---------- 1a. Telefon raqamlari ---------- */
document.querySelectorAll('[data-phone]').forEach(function (el) {
  el.href = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '');
  var slot = el.querySelector('.hdr__tel-txt');
  if (slot) slot.textContent = CONFIG.phone;
  else if (!el.children.length) el.textContent = CONFIG.phone;
  el.addEventListener('click', function () { trackCta('phone'); });
});

/* ---------- 1b. Ijtimoiy tarmoq ikonkalari (header) ---------- */
document.querySelectorAll('[data-social]').forEach(function (el) {
  var platform = el.dataset.social;
  var url = CONFIG.social[platform];
  if (url) el.href = url;
  el.target = '_blank';
  el.rel = 'noopener';
  el.addEventListener('click', function () { trackCta('social_' + platform); });
});

/* ---------- 2. Scroll-reveal animatsiyasi ---------- */
var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealables = document.querySelectorAll('.reveal');

if (reduced || !('IntersectionObserver' in window)) {
  revealables.forEach(function (el) { el.classList.add('is-in'); });
} else {
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
      el.classList.add('is-in');
      revealObs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  revealables.forEach(function (el) { revealObs.observe(el); });
}

/* ---------- 3. "Video 8 soatdan keyin ochib ketadi" taymeri ----------
   Saqlanmaydi — sahifaga har safar (yangidan) kirilganda taymer 8 soatdan
   qaytadan boshlanadi (localStorage ishlatilmaydi). */
(function () {
  var box = document.querySelector('.offer-timer');
  if (!box) return;

  var hEl = box.querySelector('[data-timer="h"]');
  var mEl = box.querySelector('[data-timer="m"]');
  var sEl = box.querySelector('[data-timer="s"]');
  var DURATION = 8 * 60 * 60 * 1000;
  var end = Date.now() + DURATION;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var left = end - Date.now();
    if (left <= 0) {
      end = Date.now() + DURATION;
      left = DURATION;
    }
    hEl.textContent = pad(Math.floor(left / 3600000));
    mEl.textContent = pad(Math.floor((left % 3600000) / 60000));
    sEl.textContent = pad(Math.floor((left % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();

/* ---------- 4. Taymer och fonli bloklar ustidan o'tayotganda qoraya, o'tib bo'lgach oqarib qaytadi ----------
   .offer-timer fixed turgani uchun ekranda joyi o'zgarmaydi — sahifa scroll qilinganda
   .pain-photo rasmi va .stats-card (statistika bloki, ikkalasi ham och fonli)
   UNING OSTIDAN o'tadi. Taymer ular bilan qanday fonda bo'lsa ham ko'rinishi uchun
   (och fonli blok ustida taymerning o'zi ham och bo'lsa yo'qolib qoladi) — ulardan
   BIRI bilan kesishganda "is-dark" klassi qo'shiladi, kesishish tugasa olib tashlanadi.
   'scroll' hodisasiga emas, har freymga tekshiruvga tayanadi — shunda iOS'dagi
   inersiyali scroll paytida ham rang almashinishi kechikmaydi. */
(function () {
  var timer = document.querySelector('.offer-timer');
  var photo = document.querySelector('.pain-photo');
  var statsCard = document.querySelector('.stats-card');
  if (!timer || (!photo && !statsCard)) return;

  function overlaps(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function loop() {
    var timerRect = timer.getBoundingClientRect();
    var isOver =
      (photo && overlaps(timerRect, photo.getBoundingClientRect())) ||
      (statsCard && overlaps(timerRect, statsCard.getBoundingClientRect()));
    timer.classList.toggle('is-dark', !!isOver);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ---------- 5. Kvize oynasi ----------
   "Videoni ko'rish" tugmasi (teaser blok) videoga to'g'ridan-to'g'ri
   olib bormaydi — avval shu kvize ochiladi: 1) joylashuv (tugma variantlar),
   2) ism, 3) telefon raqami (ikkalasi ham matn maydoni — lead sifatida).
   Barcha 3 savolga javob berilgach "Videoni ko'rish" tugmasi chiqadi va
   CONFIG.videoUrl'ni ochadi.
   MUHIM: hozircha backend/CRM ulanmagan — ism va telefon hech qayerga
   YUBORILMAYDI, faqat foydalanuvchi ko'z oldida qoladi. Buni real leadga
   aylantirish uchun finishBtn bosilganda quizName/quizPhone qiymatlarini
   qandaydir backend'ga (Telegram bot, Google Sheets, CRM va h.k.) yuborish
   kerak bo'ladi — bu qadam hali qo'shilmagan. */
(function () {
  var overlay = document.getElementById('quizOverlay');
  var card = overlay ? overlay.querySelector('.quiz-card') : null;
  var closeBtn = document.getElementById('quizClose');
  var finishBtn = document.getElementById('quizFinish');
  var hint = document.getElementById('quizHint');
  var questions = overlay ? overlay.querySelectorAll('.quiz-q') : [];
  if (!overlay || !card) return;

  function isQuestionAnswered(q) {
    var input = q.querySelector('.quiz-input');
    if (input) {
      if (input.id === 'quizPhone') {
        // "digits===9 YOKI digits===12" qoidasi ham yetarli emas edi:
        // "+998903456" — 9 ta raqam ("998"+6 ta), lekin "998" bilan
        // BOSHLANGANI uchun aslida to'liqsiz 998-kodli raqam, shunchaki
        // tasodifan uzunligi 9ga teng bo'lib qolgan. Shu sababli avval
        // "998" bilan boshlanish-boshlanmasligini aniqlab, keyin SHU
        // holatga mos aniq uzunlikni talab qilamiz.
        var digits = input.value.replace(/\D/g, '');
        if (digits.slice(0, 3) === '998') return digits.length === 12;
        return digits.length === 9;
      }
      return input.value.trim().length > 0;
    }
    return !!q.querySelector('.quiz-opt.is-selected');
  }

  function allAnswered() {
    return Array.prototype.every.call(questions, isQuestionAnswered);
  }

  function updateFinishVisibility() {
    var done = allAnswered();
    finishBtn.hidden = !done;
    hint.hidden = done;
  }

  function openQuiz() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    // requestAnimationFrame ba'zi muhitlarda kechikishi/ishlamay qolishi mumkin
    // (natijada oyna "yopishib", yarim shaffof holatda qolib ketadi). Shuning
    // o'rniga layout'ni majburan o'qib (reflow), keyingi qatorda darhol klass
    // qo'shamiz — bu opacity/transition'ni har doim ishonchli ishga tushiradi.
    void overlay.offsetHeight;
    overlay.classList.add('is-on');
    trackCta('quiz_open');
  }

  function closeQuiz() {
    overlay.classList.remove('is-on');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 250);
  }

  document.querySelectorAll('.js-quiz-trigger').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openQuiz();
    });
  });

  closeBtn.addEventListener('click', closeQuiz);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeQuiz();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeQuiz();
  });

  questions.forEach(function (q) {
    q.querySelectorAll('.quiz-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        q.querySelectorAll('.quiz-opt').forEach(function (o) { o.classList.remove('is-selected'); });
        opt.classList.add('is-selected');
        updateFinishVisibility();
      });
    });
    q.querySelectorAll('.quiz-input').forEach(function (inp) {
      inp.addEventListener('input', updateFinishVisibility);
    });
  });

  /* "Videoni ko'rish" bosilganda darhol videoga otqazib yubormaymiz —
     avval qisqa "Video yuklanmoqda" oynasini ko'rsatamiz, keyin video ochiladi. */
  var loading = document.getElementById('quizLoading');

  /* Anketa javoblarini (joylashuv, ism, telefon) Google Sheets'ga yuborish.
     CONFIG.sheetsUrl — Google Apps Script "Web app" manzili (mijoz o'zi
     deploy qilgan). 'no-cors' + 'text/plain' ataylab shunday: aks holda
     brauzer avval CORS "preflight" so'rovi yuboradi, Apps Script esa uni
     to'g'ri qayta ishlamaydi va so'rov butunlay muvaffaqiyatsiz tugaydi.
     Javobni o'qiy olmaymiz (bu normal) — faqat yuborib qo'yamiz, natija
     videoni ochilishiga hech qanday ta'sir qilmaydi. */
  function sendLead() {
    if (!CONFIG.sheetsUrl) return;
    var locOpt = questions[0] ? questions[0].querySelector('.quiz-opt.is-selected') : null;
    var nameEl = document.getElementById('quizName');
    var phoneEl = document.getElementById('quizPhone');
    var payload = {
      location: locOpt ? locOpt.textContent.trim() : '',
      name: nameEl ? nameEl.value.trim() : '',
      phone: phoneEl ? phoneEl.value.trim() : ''
    };
    try {
      fetch(CONFIG.sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (e) { /* lead yuborilmasa ham video ochilishiga xalaqit bermasin */ }
  }

  finishBtn.addEventListener('click', function (e) {
    e.preventDefault(); // videoni o'zimiz, kechiktirib ochamiz
    sendLead();
    var url = finishBtn.href;
    closeQuiz();

    /* MUHIM: yangi tab OCHILMAYDI (avval "window.open('', '_blank')" bilan
       oldindan ochib qo'yilgan edi — bu popup-blokerni chetlab o'tsa ham,
       telefon brauzerlari (Android/iPhone) yangi tab ochilgan zahoti undan
       DARHOL o'sha (hali bo'sh) tabga o'tkazib yuboradi, natijada "Video
       yuklanmoqda" oynasi eski tabda qolib ketib UMUMAN ko'rinmay qolardi).
       Endi video xuddi SHU tabning o'zida ochiladi — loading oynasi to'liq
       ko'rinadi, kechikish tugagach video shu joyning o'zida ochiladi.
       Bonus: bu popup-bloker muammosiga ham umuman tegishli emas, chunki
       yangi oyna/tab umuman ochilmaydi. */
    if (!loading) { location.href = url; return; }

    loading.hidden = false;
    document.body.style.overflow = 'hidden';
    void loading.offsetHeight; // majburiy reflow — fade-in doim ishga tushishi uchun
    loading.classList.add('is-on');

    setTimeout(function () {
      location.href = url;
    }, 3500);
  });

  updateFinishVisibility();
})();

/* ---------- 6. Statistika raqamlarini scroll qilinganda animatsiya bilan sanash ---------- */
(function () {
  var counters = document.querySelectorAll('.js-count');
  if (!counters.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatNumber(n) {
    // "10 000" kabi bo'sh joy bilan minglik ajratkichi (ru-RU formati shuni beradi)
    return Math.round(n).toLocaleString('ru-RU');
  }

  function animateCount(el) {
    var target = Number(el.dataset.target) || 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out kub
      el.textContent = formatNumber(target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target);
    }
    requestAnimationFrame(step);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = formatNumber(Number(el.dataset.target) || 0); });
  } else {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObs.unobserve(entry.target); // faqat bir marta ishlasin
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObs.observe(el); });
  }
})();
