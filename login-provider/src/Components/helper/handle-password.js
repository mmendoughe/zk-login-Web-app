function stringToNumber(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);

  let result = 0;
  for (let i = 0; i < bitArray.length; i++) {
    result = (result << 8) | bitArray[i];
  }
  return result;
}

export { stringToNumber };
