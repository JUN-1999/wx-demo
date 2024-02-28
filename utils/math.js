// 加
export const add = function (num1 = 0, num2 = 0, decimalPlaces, round = true) {
  const sum = parseFloat(num1) + parseFloat(num2);
  return numPrecision(sum, decimalPlaces, round);
};
// 减
export const subtract = function (
  num1 = 0,
  num2 = 0,
  decimalPlaces,
  round = true
) {
  const difference = parseFloat(num1) - parseFloat(num2);
  return numPrecision(difference, decimalPlaces, round);
};
// 乘
export const multiply = function (
  num1 = 0,
  num2 = 0,
  decimalPlaces,
  round = true
) {
  const product = parseFloat(num1) * parseFloat(num2);
  return numPrecision(product, decimalPlaces, round);
};
// 除
export const divide = function (
  num1 = 0,
  num2 = 0,
  decimalPlaces = 2,
  round = true
) {
  if (num2 == 0) return 0;
  const quotient = parseFloat(num1) / parseFloat(num2);
  return numPrecision(quotient, decimalPlaces, round);
};
// decimalPlaces 保留得位数  round true为四舍五入  false为截取几位
function numPrecision(num, decimalPlaces = 2, round) {
  if (round) {
    return Number(num.toFixed(decimalPlaces));
  } else {
    const multiplier = 10 ** decimalPlaces;
    return Number(Math.floor(num * multiplier) / multiplier);
  }
}