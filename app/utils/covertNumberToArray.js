// 10000000
export default (number, total) => {
  const totalStr = total.toString();
  const numbStr = number.toString();
  const digits = numbStr.split('');

  let difference = totalStr.length - numbStr.length;

  while (difference > 0) {
    digits.unshift('0');
    difference -= 1;
  }
  return digits;
};
