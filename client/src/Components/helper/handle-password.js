/* eslint-disable no-undef */
// var sha256 = require("js-sha256");

// const CryptoJS = require("crypto-js");

function stringToBitArray(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);
  return bitArray;
}

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
    console.log("Ascii String:", asciiString);
    console.log("BigInt:", BigInt(asciiString));

  return BigInt(asciiString).toString();
}

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

function xorBigInts(bigInt1, bigInt2, bigInt3) {
  // Convert BigInts to binary strings
  let bin1 = bigInt1.toString(2);
  let bin2 = bigInt2.toString(2);
  let bin3 = bigInt3.toString(2);

  // Find the maximum length among the binary strings
  const maxLength = Math.max(bin1.length, bin2.length, bin3.length);

  // Pad binary strings with leading zeros to match the maximum length
  bin1 = bin1.padStart(maxLength, '0');
  bin2 = bin2.padStart(maxLength, '0');
  bin3 = bin3.padStart(maxLength, '0');

  // Initialize an empty string for the result
  let result = '';

  // XOR each bit
  for (let i = 0; i < maxLength; i++) {
    const bit1 = bin1[i] === '1' ? 1 : 0;
    const bit2 = bin2[i] === '1' ? 1 : 0;
    const bit3 = bin3[i] === '1' ? 1 : 0;
    const xorBit = bit1 ^ bit2 ^ bit3;
    result += xorBit.toString();
  }

  // Convert the result binary string back to a BigInt
  return BigInt('0b' + result);
}

/*function hash(str) {
  const hash = sha256.create();
  hash.update(str);
  const h = hash.hex();
  return h;
}

function splitTo128BitArrays(bitArray) {
  const chunkSize = 10;
  const chunks = [];

  for (let i = 0; i < bitArray.length; i += chunkSize) {
    const chunk = bitArray.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

function convertToFieldArray(byteArray) {
  let fieldArray = [];
  for (let i = 0; i < 16; i++) {
    fieldArray.push(byteArray[i]);
  }
  return fieldArray;
}

*/function convertToFieldString(byteArray) {
  let fieldString = "";
  for (let i = 0; i < byteArray.length; i++) {
    fieldString += byteArray[i].toString();
  }
  return fieldString;
}/*

// Function to convert a byte array to a hex string
function byteArrayToHexString(byteArray) {
  return byteArray
    .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
    .join("");
}

// Function to hash four 16-byte arrays and return two 16-byte arrays
function hashByteArray(args, toHex = false) {
  // Convert concatenated array to WordArray
  let wordArray = CryptoJS.lib.WordArray.create(args);

  // Hash the concatenated array using SHA-256
  let hash = CryptoJS.SHA256(wordArray);
  console.log("Hash:", hash.toString());

  // Convert the hash to a byte array
  let hashArray = CryptoJS.enc.Hex.parse(hash.toString()).words;
  console.log("Hash array:", hashArray);
  // Convert hashArray to a byte array
  let byteArray = [];
  for (let i = 0; i < hashArray.length; i++) {
    let word = hashArray[i];
    byteArray.push((word >> 24) & 0xff);
    byteArray.push((word >> 16) & 0xff);
    byteArray.push((word >> 8) & 0xff);
    byteArray.push(word & 0xff);
  }

  // Split the hash into two 16-byte arrays
  let hashArray1 = byteArray.slice(0, 16);
  let hashArray2 = byteArray.slice(16, 32);

  // Return the results as hex strings if requested
  if (toHex) {
    return [byteArrayToHexString(hashArray1), byteArrayToHexString(hashArray2)];
  } else {
    return [hashArray1, hashArray2];
  }
}*/

export {
  convertToFieldString,
  stringToBitArray,
  stringToNumber,
  stringToBigInts,
  xorBigInts,
};
