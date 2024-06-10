
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

  sendTransaction(tx) {
    return this.provider.broadcastTransaction(tx);
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

  async getSigner() {
    console.log("Getting signer");
    console.log(this.provider);
    return await this.provider.getSigner();
  }

  getTransactionReceipt(hash) {
    return this.provider.getTransactionReceipt(hash);
  }
}

export { Web3Provider };