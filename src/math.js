const calculateTip = (total, tipPercent = 0.25) => total + total * tipPercent;

const fahrenheitToCeleius = (temp) => {
  return (temp - 32) / 1.8;
};

const celeiusToFahrenheit = (temp) => {
  return temp * 1.8 + 32;
};

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    // Async process
    setTimeout(() => {
      if (a < 0 || b < 0) {
        reject("Numbers have to be positive!");
      }

      resolve(a + b);
    }, 2000);
  });
};

module.exports = {
  calculateTip,
  fahrenheitToCeleius,
  celeiusToFahrenheit,
  add,
};
