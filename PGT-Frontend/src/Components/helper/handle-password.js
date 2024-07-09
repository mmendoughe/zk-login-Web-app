/* eslint-disable no-undef */
// Part of the encoding was taken from https://www.claritician.com/how-to-encode-a-string-of-text-into-a-number-and-then-back-in-javascript.

/**
 * stringToBigInts converts a string to an array of BigInts to use as u64 values in zokrates.
 * @param str: string
 * @returns string[]: String representations of BigInts
 */
function stringToBigInts(str) {
  // Split the string into chunks of 5 characters so that the bigInt can be converted to u64
  const asciistring = encodeURIComponent(str);
  const chunks = [];
  for (let i = 0; i < asciistring.length; i += 5) {
    chunks.push(asciistring.slice(i, i + 5));
  }

  // Encode each chunk to a BigInt
  return chunks.map(encodeChunk);
}

/**
 * encodeChunk encodes a chunk of a string to a BigInt.
 * @param asciiStr: string
 * @returns string representation of BigInt
 */
function encodeChunk(asciiStr) {
  const chars = asciiStr.split("");

  const hexChars = chars.map((ch) =>
      ch.codePointAt(0).toString(16).padStart(2, "0")
  );

  const hexNumber = hexChars.join("");
  const m = BigInt(`0x${hexNumber}`);

  return m.toString();
}

/**
 * decodeChunk decodes a BigInt to a chunk of a string.
 * Used for testing the encoding.
 * @param m: string representation of BigInt
 * @returns {string}
 */
function decodeChunk(m) {
  const bigInt = BigInt(m);
  let hexNumber = bigInt.toString(16);
  if (hexNumber.length % 2 === 1) {
    hexNumber = "0" + hexNumber;
  }

  const hexChars = hexNumber.match(/\w{2}/g);

  const chars = hexChars.map((hex) =>
      String.fromCodePoint(parseInt(hex, 16))
  );

  const asciiStr = chars.join("");
  const text = decodeURIComponent(asciiStr);

  return text;
}

/**
 * bigIntsToString converts an array of BigInts to a string.
 * @param bigInts
 * @returns string
 */
function bigIntsToString(bigInts) {
  return bigInts.map(decodeChunk).join("");
}

/**
 * convertToFieldString converts a byte array to a string that can be used as a field in zokrates..
 * @param byteArray
 * @returns {string}
 */
function convertToFieldString(byteArray) {
  let fieldString = "";
  for (let i = 0; i < byteArray.length; i++) {
    fieldString += byteArray[i].toString();
  }
  return fieldString;
}

/**
 * encodeAddressToBigInts encodes an Ethereum address to an array of BigInts.
 * @param address
 * @returns {string[]}
 */
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

/**
 * bigIntsToAddress converts an array of BigInts to an Ethereum address.
 * @param bigInts
 * @returns {string}
 */
function bigIntsToAddress(bigInts) {
  return "0x" + bigInts.map(bigInt => BigInt(bigInt).toString(16).padStart(10, '0')).join('');
}

export {
  convertToFieldString,
  stringToBigInts,
  encodeAddressToBigInts,
  bigIntsToAddress,
  bigIntsToString,
};
