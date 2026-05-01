# Loyiha Hisoboti — Reja Ilovasi

**Sana:** 2026-04-28  
**GitHub:** https://github.com/khikmat64168-cyber/reja  

---

## 1. TRAIN.JS — JavaScript Mashqlari

### Fayl boshqaruvi
- `TRAIN.js` (views papkasida) → `train.js` (loyiha ildiziga) ko'chirildi
- `package.json` da `"train": "nodemon train.js"` scripti sozlandi

### Tuzatilgan xatolar
| Xato | Sabab |
|------|-------|
| `console list = [` | `const list` bo'lishi kerak edi |
| `functionLetter(...)` | `function` kalit so'zi noto'g'ri yozilgan |
| `return count` loop ichida | Loop tashqarisiga chiqarildi |
| `setinterval` | `setInterval` bo'lishi kerak (katta I) |
| Yopilmagan `}` qavslar | Bir necha marta `else {}` va funksiya qavslar tuzatildi |
| Ikki `maslahatBering` funksiyasi | Biri comment qilindi |
| `maslaatBering` | `maslahatBering` — `h` harfi tushib qolgan |

### O'rganilgan mavzular
- **Callback funksiyalar** — boshqa funksiyaga argument sifatida beriladigan funksiya
- **Async/Await** — `async function`, `await`, `Promise`
- **setTimeout vs setInterval** — bir marta vs qayta-qayta
- **Array.map vs Array.forEach** — farqi va qo'llanilishi

---

## 2. MITASK-A — countLetter Funksiyasi

```js
function countLetter(letter, soz) {
  let count = 0;
  for (let i = 0; i < soz.length; i++) {
    if (soz[i] === letter) {
      count++;
    }
  }
  return count;
}
// countLetter("e", "engineer") → 3
```

**Maqsad:** String ichida berilgan harf necha marta uchrashini topish  
**Asosiy tushuncha:** `soz[i]` — stringning i-chi harfini olish

---

## 3. MITASK-B — countDigits Funksiyasi

```js
function countDigits(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') count++;
  }
  return count;
}
// countDigits("ad2a54y79wet0sfgb9") → 7
```

**Maqsad:** String ichidagi raqamlar sonini topish  
**Asosiy tushuncha:** ASCII kodlar bo'yicha `'0'` dan `'9'` gacha solishtirish

---

## 4. SERVER ARXITEKTURASI

### Fayl tuzilmasi
```
Reja/
├── server.js      ← MongoDB ulanish + server ishga tushirish
├── app.js         ← Express, routelar, middleware
├── train.js       ← JavaScript mashqlari
├── views/
│   ├── reja.ejs   ← Asosiy sahifa
│   └── author.ejs ← Muallif sahifasi
├── public/        ← Static fayllar (CSS, rasmlar)
└── database/      ← user.json
```

### server.js — MongoDB ulanish
```js
const { MongoClient } = require('mongodb');

let db;
module.exports.db = () => db;  // app.js ga export

MongoClient.connect(connectionString, options, (err, client) => {
  if (err) console.log('ERROR on connection MongoDB');
  else {
    db = client.db('Reja');
    const app = require('./app');
    console.log('MongoDB connection succeed');
    const server = http.createServer(app);
    server.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  }
});
```

### app.js — Asosiy routelar
```js
const db = require('./server').db();

// CREATE — yangi reja qo'shish
app.post('/create-item', (req, res) => {
  const new_reja = req.body.item;
  db.collection('plans').insertOne({ reja: new_reja }, (err, data) => {
    if (err) res.end('something went wrong');
    else res.redirect('/');
  });
});

// READ — barcha rejalarni ko'rsatish
app.get('/', (req, res) => {
  db.collection('plans').find().toArray((err, data) => {
    if (err) res.end('Something went wrong');
    else res.render('reja', { items: data });
  });
});
```

---

## 5. TUZATILGAN ASOSIY XATOLAR

| Fayl | Xato | Yechim |
|------|------|--------|
| `server.js` | `mongodb.connect is not a function` | `MongoClient.connect` ga o'zgartirildi |
| `server.js` | MongoDB v7 + Node v16.7 mos kelmaydi | `mongodb@4` ga downgrade qilindi |
| `app.js` | `res is not defined` | `db.collection()` ni route ichiga ko'chirildi |
| `app.js` | `reja is not defined` | `{ items: data }` sifatida yuborildi |
| `app.js` | `items.map is not a function` | `insertOne` dan keyin `res.redirect('/')` qilindi |
| `app.js` | `req.body.reja` null | Form `name="item"` — `req.body.item` ga o'zgartirildi |
| `views/reja.ejs` | Ikki `name` atributi | Biri olib tashlandi |
| MongoDB | `reja: null` yozuvlar | `deleteMany({ reja: null })` bilan o'chirildi |

---

## 6. GIT COMMITLAR

| Hash | Tavsif |
|------|--------|
| `f031404` | feat: CRUD operatsiyalari |
| `03c44d1` | feat: mongoDB ulanish logic |
| `9bc8b0c` | fix: refactoring |
| `032f018` | feat: add countLetter MITASK-A solution |
| `504c149` | feat: train callback hamda async functions |
| `1a55abc` | feat: add local social media icons |
| `b2c4069` | feat: develop author portfolio page |
| `d0e0b45` | feat: develop author router ejs page |
| `caceb7b` | BRR: views, public papkalari va create-item route |
| `0270618` | BRR: EXPRESS SERVER |
| `3abd6dc` | BRR: build express web server |

---

## 7. MUHIM TUSHUNCHALAR

- **`npm run dev`** — nodemon bilan server ishga tushiradi (fayl o'zgarganda avtomatik restart)
- **`npm run train`** — train.js ni ishga tushiradi
- **`git push`** — GitHub ga yuklaydi (upstream allaqachon sozlangan)
- **Circular dependency** — `server.js` → `app.js` → `server.js` muammosi `module.exports.db = () => db` bilan hal qilindi
- **ObjectId** — MongoDB har yozuvga avtomatik unique ID beradi, har doim boshqacha ko'rinadi
