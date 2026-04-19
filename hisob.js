let hisob = {}

hisob.kopaytirish = function(a, b) {
  return a * b;
};

hisob.bolish = function(a, b) {
  return a / b;
};

hisob.qoshish = function(a, b) {
  return a + b;
};

hisob.ayirish = function(a, b) {
  return a - b;
};

module.exports = hisob;