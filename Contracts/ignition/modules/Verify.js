const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VerifyModule", (m) => {

  const verify = m.contract("Verifier", []);

  return { verify };
});
