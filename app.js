console.log('Web serverni boshlash ');
const express = require('express');
const app = express();
const fs = require('fs');

//// MongoDB ni chaqirish
const db = require('./server').db();

let user;
fs.readFile('database/user.json', 'utf-8', (err, data) => {
  if (err) {
    console.log('ERROR:', err);
  } else {
    user = JSON.parse(data);
  }
});

//1-BOSQICH Kirish codelari expressga kirib kelayotgan malumotlarga bogg'liq bo'lgan kodd yoziladi
app.use(express.static('public')); //public papkasidagi fayllarni ochish uchun
app.use(express.json()); //json formatidagi malumotlarni objectga o'giradi ;
app.use(express.urlencoded({ extended: true })); //traditional form request instrumenti bo'lib formdan post qilingan narsani accept qiladi

//2-BOSQICH.  SESSIONga bogliq kodlar
//3-BOSQICHda  VIEWS ga bog'liq kodlar  backendda html yasab uni clientga yuboramiz
app.set('views', 'views'); //views papkasidagi fayllarni ochish uchun
app.set('view engine', 'ejs'); //ejs formatidagi fayllarni ochish uchun views folderdan o'qiydi

//4-BOSQICH.ROOTING codelari

app.post('/create-item', (req, res) => {
  console.log(req.body);
  res.json({ test: 'success' });
});

app.get('/author', (req, res) => {
  res.render('author', { user: user });
});

//  rooterlarga mo'ljallangan

// app.get('/hello', function (req, res) {
//   res.end('<h1 style="background-color: red;">Hello world ny MATTTHEW </h1>');
// });

// app.get('/gift', function (req, res) {
//   res.end('<h1>Siz sovgalar bolimidasiz</h1>');
// });
app.get('/', function (req, res) {
  res.render('reja', { reja: 'Bugungi rejam' });
});

module.exports = app;
