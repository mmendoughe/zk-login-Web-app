import { initialize } from "zokrates-js";
import { convertToFieldString } from "../UI/helper/handle-password";

async function makeProof(password) {
  let argsHash = [];
  for (let i = 0; i < password.length; i++) {
    argsHash.push(convertToFieldString(password[i]));
  }
  console.log("Args:", argsHash);

  const zokratesProvider = await initialize();
  console.log("Zokrates initialized");

  const sourceHash = `
    import "hashes/sha256/512bitPacked" as sha256packed;
    def main(private field a, private field b, private field c, private field d) -> field[2] {
      field[2] h = sha256packed([a, b, c, d]);
      return h;
    }`;

  const artifactsHash = zokratesProvider.compile(sourceHash);
  console.log("Compiled Hashes");

  const outputHashString = zokratesProvider.computeWitness(
    artifactsHash,
    argsHash
  ).output;

  return { outputHashString };
}

export { makeProof };
