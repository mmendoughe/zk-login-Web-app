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
    console.log("Ascii String:", asciiString);
    console.log("BigInt:", BigInt(asciiString));

  return BigInt(asciiString).toString();
}

export { stringToNumber };
