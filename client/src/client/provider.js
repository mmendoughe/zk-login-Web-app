import { getBytes } from "ethers";

class Web3Provider {
  provider;
  address;

  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
  }

  getChainID() {
    return this.provider.getNetwork().then((net) => net.chainId);
  }

  signMessage(msg) {
    const signer = this.provider.getSigner();
    return signer.signMessage(getBytes(msg));
  }

  sendTransaction(tx) {
    const signer = this.provider.getSigner();
    return signer.sendTransaction(tx);
  }

  onBlock(listener) {
    this.provider.on("block", listener);
  }

  offBlock(listener) {
    this.provider.off("block", listener);
  }

  getAddress() {
    return this.address;
  }
}

export { Web3Provider };