// /////////////// B- TASK/////////

function nonvoyxona(callback) {
  setTimeout(() => {
    const nonBor = Math.random() > 0.5;
    if (nonBor) {
      callback(null, 'Issiq non');
    } else {
      callback('Non qolmabdi!', null);
    }
  }, 2000);
}

nonvoyxona((err, data) => {
  if (err) {
    console.log('Xato: ' + err);
    return;
  }
  console.log('Natija: ' + data);
});

// function raqamlaniHisobla(str) {
//   let count = 0;
//   for (let i = 0; i < str.length; i++) {
//     if (str[i] >= '0' && str[i] <= '9') count++;
//   }
//   return count;
// }

// console.log(raqamlaniHisobla('ad2a54y79wet0sfgb9'));

// //////////////////A-TASK////////////////////

// // function countLetter(letter, soz) {
// //   let count = 0;
// //   for (let i = 0; i < soz.length; i++) {
// //     if (soz[i] === letter) {
// //       count++;
// //     }
// //   }
// //   return count;
// // }

// // console.log(countLetter('e', 'engineer'));

// // //CALLBACK FUNKSIYALAR///////////////////////

// // // function maslahatBering(a, callback) {
// // //   if (typeof a !== 'number') callback('insert a number', null);
// // //   else if (a <= 20) callback(null, list[0]);
// // //   else if (a > 20 && a <= 30) callback(null, list[1]);
// // //   else if (a > 30 && a <= 40) callback(null, list[2]);
// // //   else if (a > 40 && a <= 50) callback(null, list[3]);
// // //   else if (a > 50 && a <= 60) callback(null, list[4]);
// // //   else {
// // //     setInterval(function () {
// // //       callback(null, list[5]);
// // //     }, 5000);
// // //   }
// // // }

// // //// callback function birinchi qismi ERROR  ikkinchi qisi esa DATA ni qaytaradi

// // // console.log('passed here 0');
// // // maslahatBering(70, (err, data) => {
// // //   if (err) console.log('ERROR', err);
// // //   else {
// // //     console.log('Javob:', data);
// // //   }
// // // });

// // console.log('passed here 1');

// // // *********ASYNCHRONOUS Functions  *********

// // ///// Definition Qismi /////

// // async function maslahatBering(a) {
// //   if (typeof a !== 'number') throw new Error('insert a number');
// //   else if (a <= 20) return list[0];
// //   else if (a > 20 && a <= 30) return list[1];
// //   else if (a > 30 && a <= 40) return list[2];
// //   else if (a > 40 && a <= 50) return list[3];
// //   else if (a > 50 && a <= 60) return list[4];
// //   else {
// //     return new Promise((resolve, reject) => {
// //       setInterval(() => {
// //         resolve(list[5]);
// //       }, 5000);
// //     });
// //   }
// // }

// // ///// Call qismi /////
// // // call qismida  then va catch metodidan foydalandik

// // // console.log('passed here 0');
// // // maslahatBering(25)
// // //   .then((data) => {
// // //     console.log('Javob:', data);
// // //   })
// // //   .catch((err) => {
// // //     console.log('ERROR', err);
// // //   });

// console.log('Jack Ma maslahatlari');
// const list = [
//   "yaxshi talaba bo'ling ", //0-20
//   "to'g'ri boshliq tanlang va ko'proq hato qiling ", // 20-30
//   'ozingiz ushun ishlashni boshlang ', // 30-40
//   "siz kuchli bo'lgan narsalarni qiling ", //40-50
//   'yoshlarga sarmoya kiritish ', //50-60
//   'endi foydasi yoq', //60
// ];

// console.log('passed here 1');

// // async va await metodidan foydalangan holda chaqirish
// async function run() {
//   let Javob = await maslahatBering(65);
//   console.log(Javob);
//   Javob = await maslahatBering(40);
//   console.log(Javob);
//   Javob = await maslahatBering(50);
//   console.log(Javob);
// }

// run();
