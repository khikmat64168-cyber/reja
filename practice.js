// ========== CALLBACK MASHQLARI ==========

// 1-mashq: Oddiy callback
function salom(ism, callback) {

}

salom("Ali", function(xabar) {
  console.log(xabar);
});


// 2-mashq: Xato va data bilan callback (Node.js uslubi)
function sonniTekshir(son, callback) {

}

sonniTekshir(10, function(err, data) {
  if (err) console.log("Xato:", err);
  else console.log("Natija:", data);
});


// 3-mashq: setTimeout bilan callback
function kechikib(callback) {

}

kechikib(function() {
  console.log("3 soniyadan keyin chiqdi");
});


// ========== ASYNC / AWAIT MASHQLARI ==========

// 4-mashq: Oddiy async funksiya
async function malumotOl() {

}

malumotOl().then(data => console.log(data));


// 5-mashq: await bilan ketma-ket chaqirish
async function run() {

}

run();
