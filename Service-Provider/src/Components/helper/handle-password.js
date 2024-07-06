/* eslint-disable no-undef */

function stringToBigInts(str) {
  // Split the string into chunks of 5 characters so that the bigInt can be converted to u64
  const asciistring = encodeURIComponent(str);
  const chunks = [];
  for (let i = 0; i < asciistring.length; i += 5) {
    chunks.push(asciistring.slice(i, i + 5));
  }

  // Encode each chunk to a BigInt
  return encode(chunks.map(encodeChunk));
}

function encode(chunks) {
  if (chunks.length < 4) {
    while (chunks.length < 4) {
      chunks.push("0");
    }
  }
  return chunks;
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

export { stringToBigInts };
