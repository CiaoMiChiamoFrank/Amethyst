// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract utente {
    struct Utente {
        address id;
        string nick_name;
    }

    mapping(address => Utente) private accounts;
    mapping(address => bool) private accounts_created;
    address[] private nick_name_used;

    modifier check_exists_nick_name(string memory _name) {
        uint256 i = 0;

        for (i = 0; i < nick_name_used.length; i++) {
            require(
                (keccak256(bytes(accounts[nick_name_used[i]].nick_name)) !=
                    keccak256(bytes(_name))),
                "Mi dispiace, nick_name esistente :("
            );
        }
        _;
    }

    modifier check_exists_account() {
        require(
            !accounts_created[msg.sender],
            "L'account esiste, effettua il login :("
        );
        _;
    }

    function create_account(
        string memory _name
    ) public check_exists_account check_exists_nick_name(_name) {
        Utente memory u = Utente({id: msg.sender, nick_name: _name});

        accounts[msg.sender] = u;
        nick_name_used.push(msg.sender);
        accounts_created[msg.sender] = true;
    }

    function get_utente() public view returns (string[] memory) {
        string[] memory nick_names = new string[](nick_name_used.length);
        uint256 i = 0;

        for (i = 0; i < nick_name_used.length; i++) {
            nick_names[i] = accounts[nick_name_used[i]].nick_name;
        }

        return nick_names;
    }

    function get_utente_registrato() public view returns (bool) {
        return accounts_created[msg.sender];
    }

    function get_address() public view returns (address[] memory) {
        return nick_name_used;
    }
}
