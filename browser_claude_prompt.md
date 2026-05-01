Men Node.js + Express + MongoDB bilan yozilgan "Reja" nomli veb-ilovam bor. Menga bu loyihaning HAR BIR FAYLINI, HAR BIR QISMINI tushuntiruvchi, illyustratsiyalarga ega PowerPoint prezentatsiya tayyorlab ber. Kamida 35-40 ta slayd bo'lsin. Har bir slaydda ASCII diagramma yoki chizma bo'lsin. O'zbek tilida bo'lsin. Har bir kod qismi uchun alohida slayd tayyorla.

---

## FAYL 1: package.json

```json
{
  "name": "reja",
  "version": "1.0.0",
  "description": "BU bizning birinchi ilovamiz",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "train": "nodemon train.js"
  },
  "dependencies": {
    "ejs": "^5.0.2",
    "express": "^4.22.1",
    "mongodb": "^4.17.2",
    "nodemon": "^3.1.14"
  }
}
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- package.json nima va nima uchun kerak
- "scripts" qismi: har bir buyruq nima qiladi (start, dev, train)
- "dependencies" qismi: har bir kutubxona nima uchun kerak (express, ejs, mongodb, nodemon)

---

## FAYL 2: server.js

```js
const http = require('http');
const { MongoClient } = require('mongodb');

let db;
module.exports.db = () => db;

const connectionString = 'mongodb+srv://Matthew01:...@cluster0.../Reja';

MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) console.log('ERROR on connection MongoDB');
    else {
      db = client.db('Reja');
      const app = require('./app');
      console.log('MongoDB connection succeed');
      console.log(client);
      const server = http.createServer(app);
      let port = 3000;
      server.listen(port, () => {
        console.log(`The server is running on port ${port}`);
        console.log(`http://localhost:${port}`);
      });
    }
  },
);
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- server.js ning umumiy vazifasi
- `require('http')` va `require('mongodb')` — nima uchun kerak
- `let db` va `module.exports.db = () => db` — nima qiladi, nima uchun kerak
- connectionString — MongoDB Atlas ulanish manzili qanday ko'rinadi
- `MongoClient.connect(...)` — 3 ta parametr: connectionString, options, callback
- Callback ichidagi `if(err)...else` — xato va muvaffaqiyat holatlari
- `db = client.db('Reja')` — bazaga ulanish
- `require('./app')` — app.js ni ichkaridan yuklash
- `http.createServer(app)` va `server.listen(3000)` — server ishga tushishi
- server.js va app.js o'rtasidagi bog'liqlik diagrammasi

---

## FAYL 3: app.js

```js
console.log('Web serverni boshlash');
const express = require('express');
const app = express();
const fs = require('fs');

const db = require('./server').db();

let user;
fs.readFile('database/user.json', 'utf-8', (err, data) => {
  if (err) console.log('ERROR:', err);
  else user = JSON.parse(data);
});

// 1-BOSQICH: Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3-BOSQICH: View engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// CREATE
app.post('/create-item', (req, res) => {
  console.log('user entered /create-item');
  console.log(req.body);
  const new_reja = req.body.item;
  db.collection('plans').insertOne({ reja: new_reja }, (err, data) => {
    if (err) res.end('something went wrong');
    else res.redirect('/');
  });
});

// Author sahifasi
app.get('/author', (req, res) => {
  res.render('author', { user: user });
});

// READ
app.get('/', (req, res) => {
  console.log('user entered /');
  db.collection('plans')
    .find()
    .toArray((err, data) => {
      if (err) res.end('Something went wrong');
      else res.render('reja', { items: data });
    });
});

module.exports = app;
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- app.js ning umumiy vazifasi va server.js bilan farqi
- `const db = require('./server').db()` — circular dependency muammosi va yechimi
- `fs.readFile('database/user.json')` — fayldan ma'lumot o'qish
- 1-BOSQICH: `express.static`, `express.json`, `express.urlencoded` — har biri nima qiladi
- 3-BOSQICH: `app.set('view engine', 'ejs')` — EJS nima
- `app.post('/create-item')` — POST request qanday ishlaydi
- `req.body.item` — formdan ma'lumot qanday keladi
- `db.collection('plans').insertOne(...)` — MongoDB ga yozish
- `res.redirect('/')` — nima uchun redirect qilinadi
- `app.get('/author')` — author sahifasi va user data
- `app.get('/')` — bosh sahifa va READ operatsiyasi
- `db.collection('plans').find().toArray(...)` — MongoDB dan o'qish
- `res.render('reja', { items: data })` — EJS ga data yuborish
- `module.exports = app` — app ni export qilish

---

## FAYL 4: views/reja.ejs

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Reja</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
    />
  </head>
  <body style="background-color: #b8bbd1">
    <div class="container">
      <h1 class="text-center mb-4">Reja va maqsadlar</h1>

      <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input
              id="create-field"
              name="item"
              type="text"
              autofocus
              autocomplete="off"
              class="form-control mr-3"
              style="flex: 1"
            />
            <button class="btn btn-primary" style="border-radius: 20px">
              Yangi Reja Qo'shish
            </button>
          </div>
        </form>
      </div>

      <ul id="item-list" class="list-group pb-5">
        <% items.map(function(item) { %>
        <li
          class="list-group-item list-group-item-info d-flex align-items-center justify-content-between"
        >
          <span class="item-text"><%= item.reja %></span>
          <div>
            <button
              class="edit-me btn btn-secondary btn-sm mr-1"
              data-id="<%= item._id %>"
            >
              O'zgartirish
            </button>
            <button
              class="delete-me btn btn-danger btn-sm"
              data-id="<%= item._id %>"
            >
              O'chirish
            </button>
          </div>
        </li>
        <% }) %>
      </ul>

      <button id="clean-all" class="btn btn-danger" style="border-radius: 20px">
        Hamma Rejalarni O'chirish
      </button>
    </div>
  </body>
</html>
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- EJS nima — oddiy HTML dan farqi
- `<%= %>` va `<% %>` — farqi va qo'llanilishi
- `<form action="/create-item" method="POST">` — forma qanday ishlaydi
- `name="item"` — nima uchun muhim (req.body.item bilan bog'liqligi)
- `<% items.map(function(item) { %>` — loop EJS da qanday yoziladi
- `<%= item.reja %>` — MongoDB dan kelgan data qanday ko'rsatiladi
- `data-id="<%= item._id %>"` — MongoDB ObjectId ni HTML ga o'tkazish
- Bootstrap klasslari — list-group, btn, d-flex va boshqalar

---

## FAYL 5: views/author.ejs

```html
<!-- LEFT FRAME (305px) -->
<div class="left_frame">
  <img src="/images/profile.png" />
  <div><%= user.name %></div>
  <div><%= user.profession %></div>

  <!-- Ijtimoiy tarmoqlar -->
  <div class="left-icons">
    <a href="#"><img src="/images/icons/Icons-facebook.png" /></a>
    <a href="#"><img src="/images/icons/Icons-instagram.png" /></a>
    <!-- ... -->
  </div>

  <!-- Shaxsiy ma'lumotlar -->
  <div class="info-row">
    <span class="info-label">Age:</span>
    <span><%= user.age %></span>
  </div>

  <!-- Tillar (progress bar bilan) -->
  <% user.languages.forEach(function(lang) { %>
  <div class="skill-item">
    <span><%= lang.name %></span>
    <span><%= lang.percent %>%</span>
    <div class="progress-fill" style="width:<%= lang.percent %>%"></div>
  </div>
  <% }) %>

  <!-- Ko'nikmalar -->
  <% user.skills.forEach(function(skill) { %>
  <div class="skill-item">
    <span><%= skill.name %></span>
    <div class="progress-fill" style="width:<%= skill.percent %>%"></div>
  </div>
  <% }) %>
</div>

<!-- MID FRAME -->
<div class="mid_frame">
  <div class="hero">
    <h1>Software Engineer in IT Company</h1>
    <p>Lorem ipsum...</p>
    <a href="#" class="hire-btn">HIRE ME →</a>
    <img src="/images/profile.png" class="hero-img" />
  </div>

  <!-- Services grid (3x2) -->
  <div class="services-grid">
    <div class="service-card">Web Development</div>
    <div class="service-card">UI/UX Design</div>
    <div class="service-card">Sound Design</div>
    <div class="service-card">Mobile App</div>
    <div class="service-card">Photography</div>
    <div class="service-card">Advertising</div>
  </div>
</div>

<!-- RIGHT FRAME (108px) -->
<div class="right_frame">
  <a class="nav-icon"><i class="fa fa-home"></i></a>
  <!-- ... -->
</div>
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- author.ejs ning umumiy tuzilmasi (3 qism: left, mid, right)
- user.json dan kelgan data qanday ko'rsatiladi
- `user.languages.forEach(...)` — dinamik progress bar qanday ishlaydi
- Hero section tuzilmasi
- Services grid — 3x2 kartochkalar
- CSS bilan bog'liqlik (main.css)

---

## FAYL 6: train.js — JavaScript mashqlari

### MITASK-A: countLetter

```js
function countLetter(letter, soz) {
  let count = 0;
  for (let i = 0; i < soz.length; i++) {
    if (soz[i] === letter) count++;
  }
  return count;
}
console.log(countLetter('e', 'engineer')); // 3
```

### MITASK-B: countDigits

```js
function raqamlaniHisobla(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') count++;
  }
  return count;
}
console.log(raqamlaniHisobla('ad2a54y79wet0sfgb9')); // 7
```

### Callback funksiya:

```js
const list = ["yaxshi talaba bo'ling", "to'g'ri boshliq tanlang", ...];

function maslahatBering(a, callback) {
  if (typeof a !== 'number') callback('insert a number', null);
  else if (a <= 20) callback(null, list[0]);
  else if (a > 20 && a <= 30) callback(null, list[1]);
  else if (a > 30 && a <= 40) callback(null, list[2]);
  else if (a > 40 && a <= 50) callback(null, list[3]);
  else if (a > 50 && a <= 60) callback(null, list[4]);
  else {
    setInterval(function() {
      callback(null, list[5]);
    }, 5000);
  }
}

maslahatBering(25, (err, data) => {
  if (err) console.log('ERROR', err);
  else console.log('Javob:', data);
});
```

### Async/Await:

```js
async function maslahatBering(a) {
  if (typeof a !== 'number') throw new Error('insert a number');
  else if (a <= 20) return list[0];
  else if (a > 20 && a <= 30) return list[1];
  else if (a > 30 && a <= 40) return list[2];
  else if (a > 40 && a <= 50) return list[3];
  else if (a > 50 && a <= 60) return list[4];
  else {
    return new Promise((resolve) => {
      setInterval(() => resolve(list[5]), 5000);
    });
  }
}

async function run() {
  let Javob = await maslahatBering(65);
  console.log(Javob);
  Javob = await maslahatBering(40);
  console.log(Javob);
}
run();
```

Bu fayl haqida quyidagi slaydlar tayyorla:

- MITASK-A: countLetter — `soz[i]` indeks bilan string qanday o'qiladi
- MITASK-A: for loop va if shart qanday ishlaydi (jadval bilan)
- MITASK-B: countDigits — ASCII kod nima, `>= '0' && <= '9'` nima degani
- Callback nima — hayotiy analog bilan
- `maslahatBering(a, callback)` — callback parameter qanday ishlaydi
- `setInterval` vs `setTimeout` — farqi
- Async/Await nima — callback bilan farqi
- `async function` va `return` — Promise avtomatik qaytarilishi
- `await` — nima kutadi, qachon davom etadi
- `new Promise((resolve, reject) => {...})` — qanday ishlaydi
- then/catch vs async/await — solishtiruv

---

## GIT VA GITHUB:

```
Commitlar tarixi:
f031404  feat: CRUD operatsiyalari
03c44d1  feat: mongoDB ulanish logic
9bc8b0c  fix: refactoring
032f018  feat: add countLetter MITASK-A solution
504c149  feat: train callback hamda async functions
1a55abc  feat: add local social media icons
b2c4069  feat: develop author portfolio page
d0e0b45  feat: develop author router ejs page
caceb7b  BRR: views, public papkalari
0270618  BRR: EXPRESS SERVER
3abd6dc  BRR: build express web server
```

Bu haqida slaydlar:

- Git nima va nima uchun kerak
- `git add`, `git commit`, `git push` — ketma-ketligi
- GitHub — local va remote farqi
- Commit tarixi — loyiha qanday rivojlangan

---

## TO'LIQ OQIM DIAGRAMMASI:

```
Foydalanuvchi brauzerda "Yangi Reja" yozadi va bosadi
         ↓
Browser → POST /create-item → server.js → app.js
         ↓
app.js: req.body.item → db.collection('plans').insertOne()
         ↓
MongoDB Atlas (bulutda) ma'lumotni saqlaydi
         ↓
res.redirect('/') → GET / → db.collection('plans').find()
         ↓
MongoDB → data array → res.render('reja', {items: data})
         ↓
EJS: items.map() → har bir item uchun <li> yaratadi
         ↓
Tayyor HTML → brauzerga yuboriladi → foydalanuvchi ko'radi
```

---

## TEXNOLOGIYALAR JADVALI:

| Texnologiya | Nima qiladi                                    | Fayl           |
| ----------- | ---------------------------------------------- | -------------- |
| Node.js     | JavaScript ni serverda ishlatish               | server.js      |
| Express     | HTTP routelar va middleware                    | app.js         |
| MongoDB     | Ma'lumotlar bazasi (NoSQL)                     | server.js      |
| EJS         | HTML template engine                           | views/\*.ejs   |
| nodemon     | Fayllar o'zgarganda server qayta ishga tushadi | package.json   |
| Bootstrap   | Tayyor CSS dizayn                              | reja.ejs       |
| Git/GitHub  | Versiya nazorati                               | barcha fayllar |
