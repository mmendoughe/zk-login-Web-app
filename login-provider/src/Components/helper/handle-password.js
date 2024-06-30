/* eslint-disable no-undef */
function stringToNumber(str) {
  /*const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);

  let result = 0;
  for (let i = 0; i < bitArray.length; i++) {
    result = (result << 8) | bitArray[i];
  }
  return result;*/
  let asciiString = Array.from(str)
    .map((char) => {
      return char.charCodeAt(0).toString().padStart(3, "0");
    })
    .join("");
    asciiString = "0x" + asciiString;

  return BigInt(asciiString).toString();
}

function encode(chunks) {
  if (chunks.length < 4) {
    while (chunks.length < 4) {
      chunks.push("0");
    }
  }
  return chunks;
}
function stringToBigInts(str) {
  // Split the string into chunks of 5 characters so that the bigInt can be converted to u64
  const chunks = [];
  for (let i = 0; i < str.length; i += 5) {
    chunks.push(str.slice(i, i + 5));
  }

  // Encode each chunk to a BigInt
  return encode(chunks.map(encodeChunk));
}

function encodeChunk(chunk) {
  let asciiString = Array.from(chunk)
    .map((char) => {
      return char.charCodeAt(0).toString().padStart(3, "0");
    })
    .join("");
  asciiString = "0x" + asciiString;
  return BigInt(asciiString).toString();
}

export { stringToNumber, stringToBigInts };
