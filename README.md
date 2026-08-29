# Implantologiya landing (VSL bridge page)

Voronka: **Landing → «Videoni ko'rish» tugmasi → 3 savolli kvize → YouTube video.**

Sahifada forma yo'q — lead YouTube tagida (video pastida) yig'iladi. Kvize
(so'rovnoma) — bu real forma emas, javoblar hech qayerga yuborilmaydi, faqat
odamni videoga psixologik jihatdan qiziqtiruvchi/tayyorlovchi bosqich.

---

## 1. Ishga tushirish

Build kerak emas. `index.html` ni brauzerda ochsangiz ham ishlaydi.
Lokal server bilan ko'rish (tavsiya etiladi):

```bash
python3 -m http.server 8080
```

Keyin brauzerda: `http://localhost:8080`

Hostingga qo'yish: butun papkani Netlify / Vercel'ga tashlab yuboring yoki
oddiy hostingning `public_html` papkasiga yuklang. Hech qanday sozlash shart emas.

---

## 2. `CONFIG` — `assets/js/main.js` boshida

```js
const CONFIG = {
  videoUrl: "https://www.youtube.com/watch?v=oepseejoW4k&t=287s",  // ✅
  phone:    "+998 95 507 78 87",             // ✅
  openInNewTab: true,
  social: {                                  // ✅ hammasi to'ldirilgan
    telegram:  "https://t.me/drubaydulloh_implant/35",
    instagram: "https://www.instagram.com/dr.ubaydull0h/",
    youtube:   "https://www.youtube.com/@DrUbaydulloh"
  }
};
```

`videoUrl` ni o'zgartirsangiz — kvize oxiridagi "Videoni ko'rish" tugmasi
avtomatik yangi linkka o'tadi.

Header'ning o'ng tomonidagi pillada 4 ta ikonka bor: qo'ng'iroq (`CONFIG.phone`) va
3 ta ijtimoiy tarmoq (`CONFIG.social`) — hammasi ishlaydi va real manzillarga olib boradi.

**Diqqat:** `videoUrl`da `&t=287s` bor — video 4:47-nuqtadan boshlab ochiladi,
boshidan emas. Bu tasodifan qo'shilgan bo'lsa, shu qismini olib tashlash kerak.

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

## 4. Pixel / Analytics ulash

`index.html` `<head>` qismida `ANALYTICS SLOT` izohi bor — Meta Pixel yoki
Google Analytics kodini o'sha yerga qo'ying. Boshqa hech narsa qilish shart emas:
`main.js` dagi `trackCta()` tugma bosilganda avtomatik event yuboradi.

| Tugma | Event nomi |
|---|---|
| Teaser blok (kvize ochilishi) | `quiz_open` |
| Kvize oxiridagi "Videoni ko'rish" | `vsl_quiz` |
| Telefon | `phone` |
| Ijtimoiy tarmoq | `social_telegram` / `social_instagram` / `social_youtube` |

---

## 5. Sahifa strukturasi

1. **Hero** — sarlavha, matn (CTA yo'q — foydalanuvchi pastga siljib teaser blokka yetadi)
2. **Rasm** — `assets/img/implant-natija.jpg`, atrofida ko'k nur
3. **«Videoda sizni nimalar kutmoqda?»** — 3 punktli teaser + **"Videoni ko'rish" tugmasi**
4. **Footer** — logotip, manzil, telefon, huquqiy eslatma
5. **Taklif taymeri** — ekranning o'ng pastki burchagiga qadalgan (`position: fixed`),
   butun sahifa davomida ko'rinib turadi, scroll bilan birga "yuradi"
6. **Kvize oynasi** — teaser tugmasi bosilganda ochiladi, videoni ko'rish shu orqali

CTA sahifada bitta joyda — teaser blokda. Hero'da tugma yo'q, pastki sticky
panel ham yo'q (bular ataylab shunday — sodda, bitta aniq yo'l).

### Kvize oynasi (`#quizOverlay`)

«Videoni ko'rish» tugmasi bosilganda video to'g'ridan-to'g'ri ochilmaydi — avval
**3 ta savoldan** iborat qisqa so'rovnoma ("Ariza qoldiring") ochiladi. Barcha
savolga javob berilgach, "Videoni ko'rish" tugmasi paydo bo'ladi va videoni ochadi.

Savollar:
1. Hozir qayerda istiqomat qilasiz? (Toshkent shahri / viloyati / Boshqa viloyat)
2. Nechta tishingiz yetishmayapti? (1 ta / 2–3 ta / 4–6 ta / 6 tadan ortiq)
3. Bu muammo qanchalik noqulaylik bermoqda? (3 daraja)

**Backend yo'q, javoblar hech qayerga yuborilmaydi** — bu faqat qiziqishni isituvchi
bosqich. Agar keyinchalik javoblarni Telegram botga yoki WhatsApp'ga yuborish kerak
bo'lsa (real lead sifatida), alohida ayting — o'sha safar ulanish kerak bo'ladi.

Savollarni o'zgartirish: `index.html` dagi `.quiz-q` bloklari. Dizaynni o'zgartirish:
`style.css` dagi "kvize oynasi" bo'limi.

**MUHIM (CTA tugma haqida):** trigger tugmaga (`.js-quiz-trigger`, teaser blokdagi
"Videoni ko'rish") haqiqiy `videoUrl` **hech qachon to'g'ridan-to'g'ri href
qilib qo'yilmaydi** (`href="#"` bo'lib qoladi) — faqat kvize oxiridagi tugma
(`#quizFinish`) haqiqiy linkka ega. Sababi: ba'zi joylashtirilgan (embed/iframe)
muhitlarda tashqi domenli href JS ishlashidan oldin ushlab qolinib, kvizeni
chetlab o'tib videoni to'g'ridan-to'g'ri ochib yuboradi — shuni oldini olish uchun.

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

## 6. Fayl tuzilishi

```
index.html                       — butun sahifa (barcha matnlar shu yerda)
assets/css/style.css             — dizayn tizimi (ranglar :root da)
assets/js/main.js                — CONFIG, CTA, taymer, scroll-animatsiya
assets/img/implant-natija.jpg    — sahifada ishlatilayotgan yagona rasm
assets/img/                      — case-1..3.jpg, doctor.jpg — hozircha ishlatilmaydi
```

Ranglarni o'zgartirish: `style.css` boshidagi `:root` — `--accent-btn` tugma rangi,
`--accent-2` matn/ikonka akcenti.

---

## 7. Tibbiy matn bo'yicha eslatma

Matnlarda ataylab «100% kafolat», «hech qachon og'rimaydi» kabi mutlaq va'dalar yo'q
(sarlavhadagi «KAFOLATLANGAN» so'zi mijozning o'z talabi bilan qo'yilgan — reklama
moderatsiyasi bo'yicha xavf borligi bir marta aytilgan). Mijoz matnni yanada
kuchaytirmoqchi bo'lsa, avval reklama qoidalarini tekshirish tavsiya etiladi.
