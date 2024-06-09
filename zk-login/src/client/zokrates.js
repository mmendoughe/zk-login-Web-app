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

  const outputHash = JSON.parse(outputHashString);
  console.log("Output:", outputHash);

  const args = [...argsHash];
  if (outputHash) {
    args.push(outputHash[0]);
    args.push(outputHash[1]);
  }
  console.log("Args with hashes:", args);

  const source = `
    import "hashes/sha256/512bitPacked" as sha256packed;
    def main(private field a, private field b, private field c, private field d, public field hash1, public field hash2) {
      field[2] h = sha256packed([a, b, c, d]);
      log("h is {}", h);
      assert(h[0] == hash1);
      assert(h[1] == hash2);
      return;
    }`;

  const artifacts = zokratesProvider.compile(source, { debug: true });
  console.log("Compiled");

  const { witness, output } = zokratesProvider.computeWitness(
    artifacts,
    args
  );
  console.log("Output:", output);
  console.log("Witness:", witness);

  const keypair = zokratesProvider.setup(artifacts.program);

  const proof = zokratesProvider.generateProof(
    artifacts.program,
    witness,
    keypair.pk
  );

  console.log("Proof:", proof);
  console.log("Output Hash:", outputHash);

  return { proof, outputHash };
}

export { makeProof };
