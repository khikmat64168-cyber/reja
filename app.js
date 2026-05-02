console.log('Web serverni boshlash ');
const express = require('express');
const app = express();
const fs = require('fs');

//// MongoDB ni chaqirish
const db = require('./server').db();
const mongodb = require('mongodb');

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

//++++++++++++ CREATE STEP 3: axios dan kelgan { reja: "..." } qabul qilinadi ++++++++++++//
app.post('/create-item', (req, res) => {
  console.log('user entered /create-item');
  const new_reja = req.body.reja;
  //++++++++++++ CREATE STEP 4: MongoDB ga yangi hujjat yoziladi ++++++++++++//
  db.collection('plans').insertOne({ reja: new_reja }, (err, data) => {
    console.log(data.ops);
    //++++++++++++ CREATE STEP 5: Kiritilgan hujjat browser.js ga JSON qaytariladi — keyingi step browser.js da ++++++++++++//
    res.json(data.ops[0]);
  });
});

//++++++++++++ DELETE STEP 3: axios dan kelgan { id: "..." } qabul qilinadi ++++++++++++//
app.post('/delete-item', (req, res) => {
  const id = req.body.id;
  //++++++++++++ DELETE STEP 4: string → ObjectID ga o'giriladi, MongoDB dan hujjat topib o'chiriladi ++++++++++++//
  db.collection('plans').deleteOne({ _id: new mongodb.ObjectID(id) }, function (err, data) {
    //++++++++++++ DELETE STEP 5: Muvaffaqiyat xabari browser.js ga qaytariladi — keyingi step browser.js da ++++++++++++//
    res.json({state: 'success'});
  });
});

app.get('/author', (req, res) => {
  res.render('author', { user: user });
});

//++++++++++++ READ STEP 3: Foydalanuvchi localhost:3000 ga kiradi — GET / so'rovi keladi ++++++++++++//
app.get('/', function (req, res) {
  console.log('user entered /');
  //++++++++++++ READ STEP 4: MongoDB dan barcha rejalar olinadi ++++++++++++//
  db.collection('plans')
    .find()
    .toArray((err, data) => {
      if (err) {
        console.log(err);
        res.end('Something went wrong');
      } else {
        console.log(data);
        //++++++++++++ READ STEP 5: Data reja.ejs ga yuboriladi — keyingi step reja.ejs da ++++++++++++//
        res.render('reja', { items: data });
      }
    });
});

module.exports = app;
