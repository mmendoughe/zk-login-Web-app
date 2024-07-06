
class Web3Provider {
  provider;
  address;

  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
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