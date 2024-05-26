function stringToBitArray(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);
  return bitArray;
}

function splitTo128BitArrays(bitArray) {
  const chunkSize = 16;
  const chunks = [];

  for (let i = 0; i < bitArray.length; i += chunkSize) {
    const chunk = bitArray.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

function convertToFieldArray(byteArray) {
  const fieldArray = [];
  for (let i = 0; i < byteArray.length; i++) {
    fieldArray.push(byteArray[i]);
  }
  return fieldArray;
}

export { stringToBitArray, splitTo128BitArrays, convertToFieldArray };
