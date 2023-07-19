const comma = (number: number) => {
  let integer = String(number);
  const pointIdx = integer.indexOf('.');
  let postfix = '';
  if (pointIdx > -1) {
    postfix = integer.slice(pointIdx);
    integer = integer.slice(0, pointIdx);
  }
  const strReversed = Array.from(integer).reverse();
  return strReversed
    .reduce((arr, char, i) => {
      if (i !== 0 && i % 3 === 0 && char !== '-') {
        arr.push(',');
      }
      arr.push(char);
      return arr;
    }, [] as string[])
    .reverse()
    .join('')
    .concat(postfix);
};

export default comma;
