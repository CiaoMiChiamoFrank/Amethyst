const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ADDRESS_UTENTE = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

module.exports = buildModule("gruppo", (m) => {
  const gruppo = m.contract("gruppo", [ADDRESS_UTENTE], {

  });

  return { gruppo };
});
