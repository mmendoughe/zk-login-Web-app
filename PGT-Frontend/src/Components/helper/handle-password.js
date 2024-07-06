/* eslint-disable no-undef */

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

function encodeChunk(asciiStr) {
  const chars = asciiStr.split("");

  const hexChars = chars.map((ch) =>
      ch.codePointAt(0).toString(16).padStart(2, "0")
  );

  const hexNumber = hexChars.join("");
  const m = BigInt(`0x${hexNumber}`);

  return m.toString();
}

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

function bigIntsToString(bigInts) {
  return bigInts.map(decodeChunk).join("");
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
