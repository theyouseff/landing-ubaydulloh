# Implantologiya landing (statik ma'lumot sahifasi)

⚠️ **Sahifada hech qanday tugma yo'q.** Video/kvize ochuvchi CTA'lar mijoz
talabi bilan olib tashlandi (2026-08-29). Sayt hozircha faqat statik ma'lumot
ko'rsatadi: sarlavha, rasm, teaser matn, taymer va aloqa ikonkalari (telefon,
Telegram, Instagram, YouTube — bular header/footer'da ishlaydi).

Videoni ochish yoki lead yig'ish uchun sahifada hech qanday yo'l yo'q.

---

## 1. Ishga tushirish

Build kerak emas. `index.html` ni brauzerda ochsangiz ham ishlaydi.
Lokal server bilan ko'rish (tavsiya etiladi):

```bash
python3 -m http.server 8080
```

Keyin brauzerda: `http://localhost:8080`

**Jonli sayt:** https://theyouseff.github.io/landing-ubaydulloh/ (GitHub Pages,
`main` branch'dan avtomatik yangilanadi — `git push` qilsangiz bir necha
daqiqada shu manzilda ko'rinadi).

---

## 2. `CONFIG` — `assets/js/main.js` boshida

```js
const CONFIG = {
  phone: "+998 95 507 78 87",             // ✅
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

1. **Hero** — sarlavha, matn (CTA yo'q)
2. **Rasm** — `assets/img/implant-natija.jpg`, atrofida ko'k nur
3. **«Videoda sizni nimalar kutmoqda?»** — 3 punktli teaser (CTA yo'q)
4. **Footer** — logotip, manzil, telefon, huquqiy eslatma
5. **Taklif taymeri** — ekranning o'ng pastki burchagiga qadalgan (`position: fixed`),
   butun sahifa davomida ko'rinib turadi, scroll bilan birga "yuradi", bosilmaydi

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
assets/js/main.js                — CONFIG, taymer, scroll-animatsiya
assets/img/implant-natija.jpg    — sahifada ishlatilayotgan yagona rasm
assets/img/                      — case-1..3.jpg, doctor.jpg — hozircha ishlatilmaydi
```

Ranglarni o'zgartirish: `style.css` boshidagi `:root` — `--accent-2` matn/ikonka
akcenti, `--accent-btn` taymerdagi urg'u rangi.

---

## 6. Avval nima bor edi (CTA/kvize bir necha marta qo'shilib-olib tashlangan)

Sahifada avval **CTA tugma → 3 savolli kvize oynasi → YouTube video** voronkasi
bor edi (referens: MedDent uslubidagi so'rovnoma — oq/quyuq navy karta, pilla
tugmalar). Mijoz buni bir necha marta qaytarib-olib tashlashni so'radi;
oxirgi holat — **butunlay yo'q**.

Agar kelajakda qaytarilishi kerak bo'lsa, quyidagilar kerak bo'ladi:
- Teaser bo'limiga CTA tugma (`.btn.btn--primary`, `data-cta`, `js-quiz-trigger`)
- Kvize oynasi (`#quizOverlay` — savollar, variant tugmalari, yakuniy CTA)
- `CONFIG.videoUrl` va unga bog'liq JS
- **MUHIM:** trigger tugmaga haqiqiy `videoUrl` to'g'ridan-to'g'ri href qilib
  qo'yilmasligi kerak (`href="#"` qoladi, faqat kvize oxiridagi tugma haqiqiy
  linkka ega bo'ladi) — aks holda ba'zi joylashtirilgan (embed) muhitlarda
  havola JS ishlashidan oldin ushlab qolinib, kvizeni chetlab o'tadi.

Qanday ko'rinishda bo'lishini (oddiy tugma, kvize, forma va h.k.) aniq ayting —
shunga qarab quramiz.

---

## 7. Tibbiy matn bo'yicha eslatma

Matnlarda ataylab «100% kafolat», «hech qachon og'rimaydi» kabi mutlaq va'dalar yo'q
(sarlavhadagi «KAFOLATLANGAN» so'zi mijozning o'z talabi bilan qo'yilgan — reklama
moderatsiyasi bo'yicha xavf borligi bir marta aytilgan). Mijoz matnni yanada
kuchaytirmoqchi bo'lsa, avval reklama qoidalarini tekshirish tavsiya etiladi.
