Men Node.js + Express + MongoDB bilan yozilgan "Reja" nomli veb-ilovamda CRUD operatsiyalarini qurdim. Menga bu jarayonni tushuntiruvchi, illyustratsiyalarga ega PowerPoint prezentatsiya tayyorlab ber. Kamida 30 ta slayd bo'lsin. Har bir slaydda ASCII diagramma yoki chizma bo'lsin. O'zbek tilida bo'lsin.

---

## LOYIHA ARXITEKTURASI

```
[Brauzer] ←→ [browser.js + axios] ←→ [Express app.js] ←→ [MongoDB Atlas]
```

Fayllar:
- `server.js` — MongoDB ulanish + HTTP server
- `app.js` — Express routes (CREATE, READ, DELETE)
- `public/browser.js` — Frontend JavaScript (axios)
- `views/reja.ejs` — HTML sahifa (EJS template)

---

## CRUD NIMA?

```
C — Create  → Yangi reja qo'shish
R — Read    → Rejalarni ko'rsatish
U — Update  → O'zgartirish (keyingi bosqich)
D — Delete  → Rejani o'chirish
```

---

## READ operatsiyasi — app.js

```js
app.get('/', function (req, res) {
  db.collection('plans')
    .find()
    .toArray((err, data) => {
      if (err) res.end('Something went wrong');
      else res.render('reja', { items: data });
    });
});
```

Bu fayl haqida slaydlar:
- `app.get('/')` — foydalanuvchi bosh sahifaga kirganda ishga tushadi
- `db.collection('plans').find()` — MongoDB dan barcha rejalarni oladi
- `.toArray()` — cursor ni oddiy array ga o'giradi
- `res.render('reja', { items: data })` — EJS ga data yuboradi
- EJS sahifada `items.map()` bilan har bir reja `<li>` ga aylanadi

---

## CREATE operatsiyasi — app.js

```js
app.post('/create-item', (req, res) => {
  const new_reja = req.body.reja;
  db.collection('plans').insertOne({ reja: new_reja }, (err, data) => {
    console.log(data.ops);
    res.json(data.ops[0]);
  });
});
```

Bu haqida slaydlar:
- `app.post('/create-item')` — POST request qabul qiladi
- `req.body.reja` — frontenddan axios orqali kelgan ma'lumot
- `db.collection('plans').insertOne()` — MongoDB ga yangi hujjat yozadi
- `data.ops[0]` — MongoDB v3 da kiritilgan hujjatni qaytaradi
- `res.json(data.ops[0])` — frontendga yangi item ni JSON sifatida yuboradi

---

## DELETE operatsiyasi — app.js

```js
const mongodb = require('mongodb');

app.post('/delete-item', (req, res) => {
  const id = req.body.id;
  db.collection('plans').deleteOne(
    { _id: new mongodb.ObjectID(id) },
    function (err, data) {
      res.json({ state: 'success' });
    }
  );
});
```

Bu haqida slaydlar:
- `req.body.id` — frontenddan kelgan MongoDB `_id` si (string)
- `new mongodb.ObjectID(id)` — string ni MongoDB ObjectID ga o'giradi
- `deleteOne({ _id: ... })` — faqat 1 ta hujjatni o'chiradi
- `res.json({ state: 'success' })` — frontendga muvaffaqiyat xabari

---

## ObjectID nima? (muhim tushuncha)

```
MongoDB da har bir hujjatning o'z ID si bor:

{ _id: ObjectID("6478abc123def456"), reja: "Kitob o'qish" }

Brauzerdan kelganda:      "6478abc123def456"  ← bu string
MongoDB da qidirish uchun: ObjectID("6478abc123def456") ← bu object

Agar o'zgartirmasak MongoDB topa olmaydi!
```

---

## FRONTEND — browser.js (CREATE)

```js
let createField = document.getElementById('create-field');

document.getElementById('create-form').addEventListener('submit', function(e) {
  e.preventDefault();

  axios.post('/create-item', { reja: createField.value })
    .then((response) => {
      document.getElementById('item-list')
        .insertAdjacentHTML('beforeend', itemTemplate(response.data));
      createField.value = '';
      createField.focus();
    })
    .catch((err) => {
      console.log('Iltimos qaytadan harakat qiling');
    });
});
```

Bu haqida slaydlar:
- `e.preventDefault()` — forma sahifani yangilamasligi uchun
- `axios.post()` — serverga JSON formatida ma'lumot yuboradi
- `response.data` — serverdan qaytgan yangi item (MongoDB hujjati)
- `insertAdjacentHTML('beforeend', ...)` — ro'yxat oxiriga yangi `<li>` qo'shadi
- Sahifa yangilanmaydi (SPA uslubida ishlaydi)

---

## FRONTEND — browser.js (DELETE)

```js
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Aniq o\'chirmoqchimisiz?')) {
      axios.post('/delete-item', { id: e.target.getAttribute('data-id') })
        .then((response) => {
          e.target.closest('li').remove();
        })
        .catch((err) => {});
    }
  }
});
```

Bu haqida slaydlar:
- `document.addEventListener('click')` — sahifadagi barcha bosimlarga quloq soladi (event delegation)
- `e.target.classList.contains('delete-me')` — bosilgan narsa o'chirish tugmasimi?
- `confirm()` — foydalanuvchidan tasdiqlash so'raydi
- `getAttribute('data-id')` — tugmadagi MongoDB ID ni oladi
- `e.target.closest('li').remove()` — serverda o'chirilgandan keyin DOM dan ham olib tashlaydi

---

## itemTemplate funksiyasi

```js
function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-info d-flex align-items-center justify-content-between">
    <span class="item-text">${item.reja}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">
        Ozgartirish
      </button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">
        O'chirish
      </button>
    </div>
  </li>`;
}
```

Bu haqida slaydlar:
- Template literal (backtick) bilan dinamik HTML yasash
- `data-id="${item._id}"` — MongoDB ID ni HTML ga saqlash usuli
- CREATE dan keyin bu funksiya ishlatiladi — sahifa yangilanmaydi

---

## TO'LIQ OQIM DIAGRAMMASI

```
CREATE:
Foydalanuvchi yozadi → submit → e.preventDefault()
→ axios.POST('/create-item', {reja: ...})
→ app.js: insertOne() → MongoDB saqlaydi
→ data.ops[0] qaytadi → itemTemplate() → <li> qo'shiladi

READ:
Sahifaga kirish → GET '/'
→ app.js: find().toArray()
→ MongoDB barcha rejalarni qaytaradi
→ res.render('reja', {items: data})
→ EJS: items.map() → har biri <li> ga aylanadi

DELETE:
O'chirish tugmasi → confirm() → getAttribute('data-id')
→ axios.POST('/delete-item', {id: ...})
→ app.js: ObjectID(id) → deleteOne()
→ MongoDB o'chiradi → closest('li').remove()
```

---

## UCHRAGAN XATOLAR VA TUZATISHLAR

### XATO 1: data attribute noto'g'ri
```html
<!-- NOTO'G'RI -->
<button data="<%=item._id%>">O'chirish</button>

<!-- TO'G'RI -->
<button data-id="<%=item._id%>">O'chirish</button>
```
Sabab: `getAttribute('data-id')` faqat `data-id` ni topadi. Terminal `null null` ko'rsatib turardi.

---

### XATO 2: MongoDB ObjectId versiya farqi
```js
// MongoDB v4 da:
new ObjectId(id)      // kichik 'd'

// MongoDB v3 da:
new ObjectID(id)      // katta 'D'
```
Sabab: MongoDB v3 va v4 da nomlanish farq qiladi. Noto'g'ri versiya ishlatilsa hujjat topilmaydi.

---

### XATO 3: DOM dan olib tashlash usuli noto'g'ri
```js
// NOTO'G'RI
e.target.parentelement.parentelement.remove()

// TO'G'RI
e.target.closest('li').remove()
```
Sabab: `parentelement` JavaScript da mavjud emas (`parentElement` bo'lishi kerak). `closest('li')` esa eng yaqin `<li>` ni topadi.

---

### XATO 4: Create routeda sintaksis xatosi va kod ikki marta yozilgan
```js
// NOTO'G'RI (nuqta yo'q)
db.collection('plans'insertOne(...)

// TO'G'RI
db.collection('plans').insertOne(...)
```

---

### XATO 5: req.body.item vs req.body.reja
```js
// EJS formada: name="item"  →  req.body.item
// Axios da:    { reja: ... } →  req.body.reja

// Ikki xil nom — axios ishlatilganda:
req.body.reja  // shu to'g'ri
```

---

## TEXNOLOGIYALAR JADVALI

| Texnologiya | Qayerda ishlatildi | Vazifasi |
|---|---|---|
| Express | app.js | HTTP routes (GET, POST) |
| MongoDB v3 | app.js | Ma'lumot saqlash va o'chirish |
| ObjectID | app.js | String → MongoDB ID ga o'girish |
| Axios | browser.js | Serverga so'rov yuborish |
| EJS | views/reja.ejs | HTML da JavaScript loop |
| event delegation | browser.js | Dinamik elementlarga click |
| closest() | browser.js | DOM dan element olib tashlash |
| data-id atributi | reja.ejs + browser.js | ID ni HTML orqali uzatish |
