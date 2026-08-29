/* ==========================================================================
   main.js — landing mantiqi
   O'ZGARTIRISH KERAK BO'LGAN YAGONA JOY — quyidagi CONFIG.
   ========================================================================== */

const CONFIG = {
  // 1) YouTube VSL videosi.
  videoUrl: "https://www.youtube.com/watch?v=5cANPWLKu88&t=0s",

  // 2) Sarlavha va pastki paneldagi telefon raqami.
  phone: "+998 95 507 78 87",

  // 3) Videoni yangi tabda ochish (true) yoki shu tabda (false).
  openInNewTab: true,

  // 4) Ijtimoiy tarmoq sahifalari (header'dagi ikonkalar).
  social: {
    telegram: "https://t.me/drubaydulloh_implant/35",
    instagram: "https://www.instagram.com/dr.ubaydull0h/",
    youtube: "https://www.youtube.com/@DrUbaydulloh"
  }
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

/* ---------- 4. Taymer rasm ustidan o'tayotganda qoraya, o'tib bo'lgach oqarib qaytadi ----------
   .offer-timer fixed turgani uchun ekranda joyi o'zgarmaydi — sahifa scroll qilinganda
   .pain-photo rasmi UNING OSTIDAN o'tadi. Ikkalasining ekrandagi to'rtburchagi
   kesishganda "is-dark" klassi qo'shiladi, kesishish tugasa olib tashlanadi.
   'scroll' hodisasiga emas, har freymga tekshiruvga tayanadi — shunda iOS'dagi
   inersiyali scroll paytida ham rang almashinishi kechikmaydi. */
(function () {
  var timer = document.querySelector('.offer-timer');
  var photo = document.querySelector('.pain-photo');
  if (!timer || !photo) return;

  function overlaps(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function loop() {
    var isOver = overlaps(timer.getBoundingClientRect(), photo.getBoundingClientRect());
    timer.classList.toggle('is-dark', isOver);
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

  finishBtn.addEventListener('click', function (e) {
    e.preventDefault(); // videoni o'zimiz, kechiktirib ochamiz
    var url = finishBtn.href;

    /* MUHIM: brauzerlar (ayniqsa Safari/iPhone) setTimeout ichidan chaqirilgan
       window.open()ni "foydalanuvchi so'ramagan popup" deb bloklaydi — chunki
       u endi bosishning "to'g'ridan-to'g'ri natijasi" hisoblanmaydi. Shu sabab
       video kechikishdan keyin OCHILMAY qolayotgan edi. Yechim: yangi tabni
       HOZIROQ, bosish paytida (bo'sh holda) ochamiz — bu hali ruxsat etiladi —
       keyin kechikish tugagach shu tabning manzilini almashtiramiz (bu esa
       popup-bloker qoidasiga umuman tegishli emas). */
    var newTab = CONFIG.openInNewTab ? window.open('', '_blank') : null;

    closeQuiz();
    if (!loading) {
      if (CONFIG.openInNewTab) { if (newTab) newTab.location.href = url; else window.open(url, '_blank', 'noopener'); }
      else location.href = url;
      return;
    }

    loading.hidden = false;
    document.body.style.overflow = 'hidden';
    void loading.offsetHeight; // majburiy reflow — fade-in doim ishga tushishi uchun
    loading.classList.add('is-on');

    setTimeout(function () {
      if (CONFIG.openInNewTab) {
        if (newTab && !newTab.closed) newTab.location.href = url;
        else window.open(url, '_blank', 'noopener'); // zaxira: tab blokланган/yopilgan bo'lsa
      } else {
        location.href = url;
      }
      loading.classList.remove('is-on');
      document.body.style.overflow = '';
      setTimeout(function () { loading.hidden = true; }, 300);
    }, 3500);
  });

  updateFinishVisibility();
})();
