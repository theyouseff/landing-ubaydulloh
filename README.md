# Implantologiya landing (VSL bridge page)

Voronka: **Landing → "Videoni ko'rish" tugmasi → 3 savolli kvize (so'rovnoma) →
YouTube VSL video**. Sahifaning yagona vazifasi — mobil tashrifchini videoni
ochishga ko'ndirish.

**Jonli sayt:** https://theyouseff.github.io/landing-ubaydulloh/ (GitHub Pages,
`main` branch'dan avtomatik yangilanadi — `git push` qilsangiz bir necha
daqiqada shu manzilda ko'rinadi).

---

## 1. Ishga tushirish

Build kerak emas. `index.html` ni brauzerda ochsangiz ham ishlaydi.
Lokal server bilan ko'rish (tavsiya etiladi):

```bash
python3 -m http.server 8080
```

Keyin brauzerda: `http://localhost:8080`

---

## 2. `CONFIG` — `assets/js/main.js` boshida

```js
const CONFIG = {
  videoUrl: "https://www.youtube.com/watch?v=oepseejoW4k&t=287s", // ✅
  phone: "+998 95 507 78 87",             // ✅
  openInNewTab: true,
  social: {                               // ✅ hammasi to'ldirilgan
    telegram:  "https://t.me/drubaydulloh_implant/35",
    instagram: "https://www.instagram.com/dr.ubaydull0h/",
    youtube:   "https://www.youtube.com/@DrUbaydulloh"
  }
};
```

Header'ning o'ng tomonidagi pillada 4 ta ikonka bor: qo'ng'iroq (`CONFIG.phone`) va
3 ta ijtimoiy tarmoq (`CONFIG.social`) — hammasi ishlaydi va real manzillarga olib boradi.

---

## 3. Placeholder ma'lumotlar (mijozdan aniqlash kerak)

| Nima | Qayerda | Hozirgi qiymat |
|---|---|---|
| Brend nomi / logotip | `index.html` — `.logo` (2 joyda: header va footer) | `DR.UBAYDULLOH` ✅ |
| Manzil | footer `.ftr__txt` | `Toshkent sh., [manzil]` |

### Ijtimoiy tarmoq uchun muqova

`assets/img/og-cover.jpg` — 1200×630. Link Telegram/Facebook/Instagram'da
ulashilganda shu rasm ko'rinadi. Rasm tayyor bo'lgach, `index.html` `<head>`
qismidagi `og:image` izohini ochib qo'ying (ikki qator).

---

## 4. Sahifa strukturasi

1. **Hero** — sarlavha, matn
2. **Rasm** — `assets/img/implant-natija.jpg`, atrofida ko'k nur
3. **«Videoda sizni nimalar kutmoqda?»** — 3 punktli teaser + **"Videoni ko'rish"
   tugmasi** (kvizeni ochadi)
4. **Footer** — logotip, manzil, telefon, huquqiy eslatma
5. **Taklif taymeri** — ekranning o'ng pastki burchagiga qadalgan (`position: fixed`),
   butun sahifa davomida ko'rinib turadi, scroll bilan birga "yuradi", bosilmaydi
6. **Kvize oynasi** (`#quizOverlay`) — pastdan chiqadigan modal, 3 savol, javob
   berilgach "Videoni ko'rish" tugmasi paydo bo'lib videoni ochadi

### Kvize oynasi (`#quizOverlay`)

"Videoni ko'rish" tugmasi (teaser blok) to'g'ridan-to'g'ri videoga olib bormaydi —
avval shu kvize ochiladi: 3 ta savol (yashash joyi, tish soni, noqulaylik darajasi),
har biri pilla shakldagi variant tugmalar bilan. Barcha savolga javob berilgach
"Videoni ko'rish" tugmasi chiqadi va `CONFIG.videoUrl`ni yangi tabda ochadi.
Backend kerak emas — javoblar hech qayerga yuborilmaydi, bu faqat qiziqishni
isituvchi bosqich (mikro-committment).

**Muhim texnik nuqtalar (ikkalasi ham amalda uchragan haqiqiy xatolarni tuzatadi):**

1. Trigger tugmaga (`.js-quiz-trigger`) haqiqiy `videoUrl` to'g'ridan-to'g'ri href
   qilib QO'YILMAYDI — `href="#"` qoladi. Faqat kvize oxiridagi tugma (`#quizFinish`)
   haqiqiy linkka ega bo'ladi. Aks holda ba'zi joylashtirilgan (embed) muhitlarda
   cross-origin havola JS ishlashidan oldin brauzer tomonidan ushlab qolinib,
   kvizeni chetlab o'tib to'g'ridan-to'g'ri videoni ochib yuboradi.
2. `.quiz-overlay{display:flex}` va `.btn{display:inline-flex}` kabi qoidalar
   brauzerning standart `[hidden]{display:none}` qoidasini bosib ketadi (bir xil
   ustuvorlikda oxirgi yozilgan qoida — muallif stili — g'alaba qiladi). Shuning
   uchun ikkalasi uchun ham aniq `[hidden]{display:none}` yozilgan — aks holda
   element "yashiringan" holatda ham ekranda ko'rinib/joy egallab turadi
   (aynan shu "sahifa oldida shaffof qatlam" muammosining sababi edi).
3. Modalni ochishda `requestAnimationFrame` o'rniga majburiy reflow
   (`void overlay.offsetHeight`) ishlatiladi — ba'zi muhitlarda rAF kechikib/
   ishlamay qolib, fade-in animatsiyasi "yopishib" yarim shaffof holatda
   qolib ketishi mumkin edi.

### Taklif taymeri (`.offer-timer`)

Sahifa matn oqimida emas — **butun saytda doim ko'rinadigan floating karta**,
o'ng pastki burchakka qadalgan, barcha ekran o'lchamlarida bir xil joyda turadi.

Statik rasm emas — **haqiqiy hisoblanadi**. Har mehmon birinchi tashrifida o'zining
shaxsiy 8 soatini oladi (`localStorage`), sahifani yopib qayta ochsa ham o'sha
joydan davom etadi. Muddat tugasa, keyingi tashrifda yana 8 soatga qayta boshlanadi.

Vaqtni o'zgartirish: `assets/js/main.js` dagi `DURATION` o'zgaruvchisi
(3-bo'limda) — `8 * 60 * 60 * 1000` millisekund.
Matnni o'zgartirish: `index.html` dagi `.offer-timer__h` ichidagi matn.
Joylashuvini o'zgartirish: `style.css` dagi `.offer-timer` — `right`/`bottom`.

**Rasm ustidan o'tayotganda qorayadi:** taymer `.pain-photo` rasmi ustiga tushganda
(ekrandagi to'rtburchaklar kesishganda) avtomatik qora rangga o'tadi, o'tib bo'lgach
oq rangga qaytadi — `main.js`ning 4-bo'limi, har freymda tekshirib turadi.

---

## 5. Fayl tuzilishi

```
index.html                       — butun sahifa (barcha matnlar shu yerda)
assets/css/style.css             — dizayn tizimi (ranglar :root da)
assets/js/main.js                — CONFIG, taymer, scroll-animatsiya, kvize
assets/img/implant-natija.jpg    — sahifada ishlatilayotgan yagona rasm
assets/img/                      — case-1..3.jpg, doctor.jpg — hozircha ishlatilmaydi
```

Ranglarni o'zgartirish: `style.css` boshidagi `:root` — `--accent-2` matn/ikonka
akcenti, `--accent-btn` / `--accent-btn-hi` tugma va taymerdagi urg'u rangi.

---

## 6. Tibbiy matn bo'yicha eslatma

Matnlarda ataylab «100% kafolat», «hech qachon og'rimaydi» kabi mutlaq va'dalar yo'q
(sarlavhadagi «KAFOLATLANGAN» so'zi mijozning o'z talabi bilan qo'yilgan — reklama
moderatsiyasi bo'yicha xavf borligi bir marta aytilgan). Mijoz matnni yanada
kuchaytirmoqchi bo'lsa, avval reklama qoidalarini tekshirish tavsiya etiladi.
