console.log('Web serverni boshlash ');
const express = require('express');
const app = express();
const http = require('http');

//1-BOSQICH Kirish codelari expressga kirib kelayotgan malumotlarga bogg'liq bo'lgan kodd yoziladi
app.use(express.static('public')); //public papkasidagi fayllarni ochish uchun
app.use(express.json()); //json formatidagi malumotlarni objectga o'giradi ;
app.use(express.urlencoded({ extended: true })); //traditional form request instrumenti bo'lib formdan post qilingan narsani accept qiladi

//2-BOSQICH.  SESSIONga bogliq kodlar
//3-BOSQICHda  VIEWS ga bog'liq kodlar  backendda html yasab uni clientga yuboramiz
app.set('views', 'views'); //views papkasidagi fayllarni ochish uchun
app.set('view engine', 'ejs'); //ejs formatidagi fayllarni ochish uchun views folderdan o'qiydi

//4-BOSQICH.ROOTING codelari
//  rooterlarga mo'ljallangan

app.get('/hello', function (req, res) {
  res.end('<h1 style="background-color: red;">Hello world ny MATTTHEW </h1>');
});

app.get('/gift', function (req, res) {
  res.end('<h1>Siz sovgalar bolimidasiz</h1>');
});

const server = http.createServer(app);
let port = 3000;
server.listen(port, () => {
  console.log(`The server is runing successfully on port  ${port}`);
});
