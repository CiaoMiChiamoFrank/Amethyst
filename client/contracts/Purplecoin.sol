// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurpleCoin is ERC20 {
    // Inizializzazione del contratto senza mintare alcun saldo all'inizio
    constructor() ERC20("PurpleCoin", "PURP") {
        // Non mintiamo nulla nel costruttore
    }

    /**
     * @dev Mint new PurpleCoins to a specific address. Can be called by anyone to reward users.
     * @param to The address to receive the PurpleCoins.
     * @param amount The amount of PurpleCoins to mint.
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount); // Mint dei token per un determinato indirizzo
    }

    /**
     * @dev Get the balance of PurpleCoins for a specific address.
     * @param account The address to query the balance for.
     * @return The balance of PurpleCoins for the provided address.
     */
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account); // Restituisce il saldo dell'indirizzo fornito
    }
}
