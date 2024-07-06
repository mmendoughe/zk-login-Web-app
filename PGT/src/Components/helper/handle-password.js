/* eslint-disable no-undef */

function stringToBigInts(str) {
  // Split the string into chunks of 5 characters so that the bigInt can be converted to u64
  const chunks = [];
  for (let i = 0; i < str.length; i += 5) {
    chunks.push(str.slice(i, i + 5));
  }

  // Encode each chunk to a BigInt
  return chunks.map(encodeChunk);
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

function convertToFieldString(byteArray) {
  let fieldString = "";
  for (let i = 0; i < byteArray.length; i++) {
    fieldString += byteArray[i].toString();
  }
  return fieldString;
}

function encodeAddressToBigInts(address) {
  if (address.startsWith("0x")) {
    address = address.slice(2);
  }
  
  const chunks = [];
  for (let i = 0; i < address.length; i += 10) { // 10 hex chars fit into a 40-bit chunk
    chunks.push(address.slice(i, i + 10));
  }
  
  return chunks.map(chunk => BigInt("0x" + chunk).toString());
}

export {
  convertToFieldString,
  stringToBigInts,
  encodeAddressToBigInts,
};
