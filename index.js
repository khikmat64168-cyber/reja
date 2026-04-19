//Module Package file

const calculate = require('./hisob.js');

const natija1 = calculate.kopaytirish(80, 20);
console.log('Natija', natija1);
console.log('*************');

const natija2 = calculate.qoshish(70, 20);
console.log('Natija', natija2);
console.log('*************');

const natija3 = calculate.ayirish(80, 20);
console.log('Natija', natija3);
console.log('*************');
// file modullarni biz fayillarimizga yozilgani uchun shunday ataladi

// console.log(require("module").wrapper);

//WRAPER node js ning qanday sintaksislari borligini ko'rsatadi 
