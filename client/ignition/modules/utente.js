const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("utente", (m) => {
  const utente = m.contract("utente", [], {
  });

  return { utente };
});
