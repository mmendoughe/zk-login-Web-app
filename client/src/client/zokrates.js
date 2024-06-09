import { initialize } from "zokrates-js";

function makeProof(passwordHash) {
  const proof = initialize().then((zokratesProvider) => {
    const source = `def main(private field a, private field b, private field c, private field d) {
      assert(a == a);
      assert(b == b);
      assert(c == c);
      assert(d == d);
      return;
  }`;
    const artifacts = zokratesProvider.compile(source);

    const { witness, output } = zokratesProvider.computeWitness(artifacts, passwordHash);
    console.log("Output:", output);
    const keypair = zokratesProvider.setup(artifacts.program);

    const proof = zokratesProvider.generateProof(
      artifacts.program,
      witness,
      keypair.pk
    );
    console.log("Proof:", proof);
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);
    console.log("Verifier:", verifier);
    return proof;
  });
  return proof;
}

export { makeProof };