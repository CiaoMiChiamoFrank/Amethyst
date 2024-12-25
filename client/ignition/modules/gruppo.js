const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ADDRESS_UTENTE = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const ADDRESS_COIN = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

module.exports = buildModule("gruppo", (m) => {
  const gruppo = m.contract("gruppo", [ADDRESS_UTENTE, ADDRESS_COIN], {

  });

  return { gruppo };
});
