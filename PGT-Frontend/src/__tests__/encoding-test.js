import { stringToBigInts, bigIntsToString, encodeAddressToBigInts, bigIntsToAddress } from '../Components/helper/handle-password';

// Tests for stringToBigInts and bigIntsToString
describe('stringToBigInts and bigIntsToString', () => {
  test('should encode and then decode back to the original string', () => {
    const originalString = "HelloWorld";
    const encoded = stringToBigInts(originalString);
    const decoded = bigIntsToString(encoded);
    expect(decoded).toBe(originalString);
  });

  test('should handle string length not a multiple of 5', () => {
    const originalString = "HelloWorld!";
    const encoded = stringToBigInts(originalString);
    const decoded = bigIntsToString(encoded);
    expect(decoded).toBe(originalString);
  });

  test('should handle empty string', () => {
    const originalString = "";
    const encoded = stringToBigInts(originalString);
    const decoded = bigIntsToString(encoded);
    expect(decoded).toBe(originalString);
  });
});

// Tests for encodeAddressToBigInts and bigIntsToAddress
describe('encodeAddressToBigInts and bigIntsToAddress', () => {
  test('should encode and then decode back to the original address', () => {
    const originalAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
    const encoded = encodeAddressToBigInts(originalAddress);
    const decoded = bigIntsToAddress(encoded);
    expect(decoded).toBe(originalAddress);
  });

  test('should handle address without 0x prefix', () => {
    const originalAddress = "70997970c51812dc3a010c7d01b50e0d17dc79c8";
    const encoded = encodeAddressToBigInts(originalAddress);
    const decoded = bigIntsToAddress(encoded);
    expect(decoded).toBe("0x" + originalAddress);
  });

  test('should handle empty address', () => {
    const originalAddress = "0x";
    const encoded = encodeAddressToBigInts(originalAddress);
    const decoded = bigIntsToAddress(encoded);
    expect(decoded).toBe(originalAddress);
  });
});
