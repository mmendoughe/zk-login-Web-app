var sha256 = require("js-sha256");

const crypto = require('crypto-browserify');

function stringToBitArray(str) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const bitArray = Array.from(encoded);
  return bitArray;
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
    if (i >= byteArray.length) {
      fieldArray.push(0);
    } else {
      fieldArray.push(byteArray[i]);
    }
  }
  return fieldArray;
}

// Function to convert a byte array to a hex string
function byteArrayToHexString(byteArray) {
    return byteArray.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

// Function to hash four 16-byte arrays and return two 16-byte arrays
function hashByteArray(array1, array2, array3, array4, toHex = false) {
    // Ensure the input arrays are 16 bytes each
    if (array1.length !== 16 || array2.length !== 16 || array3.length !== 16 || array4.length !== 16) {
        throw new Error('All input arrays must be 16 bytes long');
    }

    // Concatenate the arrays into a single 64-byte array
    let concatenatedArray = Buffer.concat([
        Buffer.from(array1),
        Buffer.from(array2),
        Buffer.from(array3),
        Buffer.from(array4)
    ]);

    // Hash the concatenated array using SHA-256
    let hash = crypto.createHash('sha256').update(concatenatedArray).digest();

    // Split the hash into two 16-byte arrays
    let hashArray1 = Array.from(hash.slice(0, 16));
    let hashArray2 = Array.from(hash.slice(16, 32));

    // Return the results as hex strings if requested
    if (toHex) {
        return [byteArrayToHexString(hashArray1), byteArrayToHexString(hashArray2)];
    } else {
        return [hashArray1, hashArray2];
    }
}

export { stringToBitArray, splitTo128BitArrays, convertToFieldArray, hash, hashByteArray };
