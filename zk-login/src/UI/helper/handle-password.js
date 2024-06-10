var sha256 = require("js-sha256");

const CryptoJS = require('crypto-js');

function stringToBitArray(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);
  return bitArray;
}

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

function hash(str) {
  const hash = sha256.create();
  hash.update(str);
  const h = hash.hex();
  console.log("Hash:", h);
  return h;
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
  let fieldArray = [];
  for (let i = 0; i < 16; i++) {
    fieldArray.push(byteArray[i]);
  }
  return fieldArray;
}

function convertToFieldString(byteArray) {
  let fieldString = "";
  for (let i = 0; i < byteArray.length; i++) {
    fieldString += byteArray[i].toString();
  }
  return fieldString;
}

// Function to convert a byte array to a hex string
function byteArrayToHexString(byteArray) {
    return byteArray.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
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
}

export { stringToBitArray, splitTo128BitArrays, convertToFieldArray, hash, hashByteArray, convertToFieldString, stringToNumber };
