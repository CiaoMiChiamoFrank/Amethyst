// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

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

    // Funzione per creare un nuovo account
    function create_account(
        address _accountAddress, // Indirizzo della persona a cui assegnare il nickname
        string memory _name
    ) public check_exists_account check_exists_nick_name(_name) {
        // Creazione dell'utente con il nickname dato
        Utente memory u = Utente({id: _accountAddress, nick_name: _name});

        // Aggiunta dell'utente al mapping e array
        accounts[_accountAddress] = u;
        nick_name_used.push(_accountAddress);
        accounts_created[_accountAddress] = true;
    }

    // Funzione per ottenere tutti gli utenti registrati
    function get_utente() public view returns (string[] memory) {
        string[] memory nick_names = new string[](nick_name_used.length);
        uint256 i = 0;

        for (i = 0; i < nick_name_used.length; i++) {
            nick_names[i] = accounts[nick_name_used[i]].nick_name;
        }

        return nick_names;
    }

    // Funzione per verificare se un utente specifico è registrato
    function get_utente_registrato(address _utente) public view returns (bool) {
        return accounts_created[_utente];
    }

    // Funzione per ottenere gli indirizzi degli utenti
    function get_address() public view returns (address[] memory) {
        return nick_name_used;
    }
}
