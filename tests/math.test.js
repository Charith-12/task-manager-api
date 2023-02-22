const {
  calculateTip,
  fahrenheitToCeleius,
  celeiusToFahrenheit,
  add,
} = require("../src/math");

test("Should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);

  //   if (total !== 13) {
  //     throw new Error("Total should be 13. Got " + total);
  //   }
});

test("Should calculate total with default value .25", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
  const tempInC = fahrenheitToCeleius(32);
  expect(tempInC).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
  const tempInF = celeiusToFahrenheit(0);
  expect(tempInF).toBe(32);
});

// test("Async test demo", (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });

test("Should add two numbers", (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});

test("Shuld add two numbers async/await", async () => {
  const sum = await add(12, 8);
  expect(sum).toBe(20);
});
