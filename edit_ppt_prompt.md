Men Node.js + Express + MongoDB bilan yozilgan "Reja" ilovamdagi UPDATE (EDIT) operatsiyasi haqida PowerPoint prezentatsiya tayyorlab ber. Kamida 15 slayd bo'lsin. Har bir slaydda ASCII chart yoki diagramma bo'lsin. O'zbek tilida bo'lsin.

---

## EDIT operatsiyasi — to'liq kod va oqim

### STEP 1-2: browser.js — foydalanuvchi tomoni

```js
// STEP 1: O'zgartirish tugmasi bosiladi
if (e.target.classList.contains('edit-me')) {

  // STEP 2: prompt oynasi ochiladi, ichida mavjud matn turadi
  let userInput = prompt(
    'Yangi ozgartirishni kiriting',
    e.target.parentElement.parentElement
      .querySelector('.item-text').innerHTML
  );
```

### STEP 3-5: app.js — server tomoni

```js
// STEP 3: axios serverga yuboradi
  if (userInput) {
    axios.post('/edit-item', {
      id: e.target.getAttribute('data-id'),
      new_input: userInput,
    })

// STEP 4-5: app.js da MongoDB yangilanadi
app.post('/edit-item', (req, res) => {
  const data = req.body;
  db.collection('plans').findOneAndUpdate(
    { _id: new mongodb.ObjectID(data.id) },
    { $set: { reja: data.new_input } },
    function(err, result) {
      res.json({ state: 'success' });
    }
  );
});
```

### STEP 6: browser.js — DOM yangilanadi

```js
    .then((response) => {
      e.target.parentElement.parentElement
        .querySelector('.item-text').innerHTML = userInput;
    })
```

---

## TO'LIQ OQIM DIAGRAMMASI

```
STEP 1: Foydalanuvchi "O'zgartirish" tugmasini bosadi
         ↓
STEP 2: prompt() oynasi ochiladi
        ichida eski matn: "Kitob o'qish"
        foydalanuvchi yozadi: "Kitob o'qish va takrorlash"
         ↓
STEP 3: axios.post('/edit-item', {
          id: "6478abc123def456",
          new_input: "Kitob o'qish va takrorlash"
        })
         ↓
STEP 4: app.js — req.body.id va req.body.new_input qabul qilinadi
         ↓
STEP 5: MongoDB — findOneAndUpdate()
        { _id: ObjectID("6478abc...") }  ← shu hujjatni topadi
        { $set: { reja: "Kitob o'qish va takrorlash" } }  ← o'zgartiradi
         ↓
STEP 6: res.json({ state: 'success' }) → browser.js ga qaytadi
         ↓
STEP 7: DOM yangilanadi — sahifa yangilanmaydi
        <span class="item-text">Kitob o'qish va takrorlash</span>
```

---

## MUHIM METODLAR — har biri uchun alohida slayd

### classList.contains()
```
e.target = bosilgan element
classList = uning barcha classlari: ['edit-me', 'btn', 'btn-secondary']
.contains('edit-me') = true yoki false qaytaradi
```

### parentElement zanjiri
```
e.target         →  <button class="edit-me">
.parentElement   →  <div>
.parentElement   →  <li>
.querySelector('.item-text')  →  <span>Kitob o'qish</span>
.innerHTML       →  "Kitob o'qish"
```

### getAttribute('data-id')
```html
<button data-id="6478abc123def456" class="edit-me">
         ↓
getAttribute('data-id')  →  "6478abc123def456"  (string)
         ↓
MongoDB ga yuboriladi → ObjectID ga o'giriladi → hujjat topiladi
```

### findOneAndUpdate()
```
findOneAndUpdate(
  { _id: ObjectID("...") },   ← 1. QAYSI hujjatni? (filter)
  { $set: { reja: "..." } },  ← 2. NIMA qilish? (update)
  function(err, result) {}    ← 3. Tugagandan keyin? (callback)
)
```

### $set operatori
```
AVVAL:   { _id: "...", reja: "Kitob o'qish" }
$set:    { reja: "Kitob o'qish va takrorlash" }
KEYIN:   { _id: "...", reja: "Kitob o'qish va takrorlash" }

Faqat ko'rsatilgan maydon o'zgaradi, qolganlari saqlanadi
```

---

## TRADITIONAL vs REST API — EDIT uchun

```
TRADITIONAL usul:             REST API usul (bizning usul):
─────────────────             ──────────────────────────────
Forma submit                  axios.post('/edit-item')
    ↓                              ↓
Sahifa to'liq yangilanadi     Sahifa yangilanmaydi
    ↓                              ↓
GET / qayta chaqiriladi       Faqat DOM dagi matn o'zgaradi
    ↓                              ↓
Sekin, ko'rimsiz              Tez, zamonaviy
```

---

## XATO VA TUZATISHLAR

### XATO 1: findOneAndUpdate sintaksisi noto'g'ri
```js
// NOTO'G'RI — barcha parametrlar birinchi {} ichiga kirib ketgan
db.collection('plans').findOneAndUpdate({
  _id: new mongodb.ObjectId(data.id),{$set:{reja:data.new_input}},
  function(err, data) { res.json({state:'success'}); }
});

// TO'G'RI — 3 ta parametr alohida
db.collection('plans').findOneAndUpdate(
  { _id: new mongodb.ObjectID(data.id) },
  { $set: { reja: data.new_input } },
  function(err, result) { res.json({ state: 'success' }); }
);
```

### XATO 2: ObjectId vs ObjectID
```js
// MongoDB v4: ObjectId  (kichik d)
// MongoDB v3: ObjectID  (katta D)  ← bizning versiya
```

### XATO 3: res.end() callback tashqarisida
```js
// NOTO'G'RI — MongoDB tugamay res.end() ishlaydi
db.collection(...).findOneAndUpdate(..., function() {
  res.json({state:'success'});
});
res.end('done');  // ← bu xato!

// TO'G'RI — faqat callback ichida javob yuboriladi
```
