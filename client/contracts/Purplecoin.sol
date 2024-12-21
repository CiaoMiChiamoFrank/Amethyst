// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PurpleCoin is ERC20 {
    // inizializo la moneta e quando viene chiamato questo contratto invio i soldi al destinatario
    constructor() ERC20("PurpleCoin", "PURP") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    /**
     * @dev Mint new PurpleCoins to a specific address. Can be called by anyone to reward users.
     * @param to The address to receive the PurpleCoins.
     * @param amount The amount of PurpleCoins to mint.
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    /**
     * @dev Get the balance of PurpleCoins for a specific address.
     * @param account The address to query the balance for.
     * @return The balance of PurpleCoins for the provided address.
     */
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    // logica per dare il premio raggiunti gli n like
    function rewardForLikes(address postOwner, uint256 likeCount) public {
        if (likeCount == 3) {
            mint(postOwner, 5 * 10 ** decimals()); // premio 5 purplecoin
        }
    }
}
