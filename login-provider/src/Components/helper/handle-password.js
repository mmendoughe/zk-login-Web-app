/* eslint-disable no-undef */

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

export { stringToBigInts };
