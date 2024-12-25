const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//const ADDRESS_UTENTE = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const ADDRESS_COIN = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

module.exports = buildModule("Amethyst", (m) => {
  const Amethyst = m.contract("Amethyst", [ADDRESS_COIN], {

  });

  return { Amethyst };
});
