// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./utente.sol";
import "./PurpleCoin.sol";

contract gruppo {
    struct Gruppo {
        uint256 id_gruppo;
        string nick_group;
        string descrizione;
        uint256 n_like;
        uint256 n_post;
    }

    struct Post {
        uint256 id_gruppo_post;
        uint256 id_post;
        string titolo;
        string descrizione;
        uint256 n_like;
        address account;
        bool rewarded;
    }

    struct Commento {
        uint256 id_post_commento;
        string descrizione;
        address account;
    }

    uint256 private count_id_gruppo = 0;
    uint256 private count_id_post = 0;
    uint256 private count_id_commento = 0;
    mapping(uint256 => Gruppo) private gruppi;
    mapping(uint256 => Post) private posts;
    mapping(uint256 => Commento) private commenti;
    mapping(address => bool) private _is_like;
    utente private utenteProgetto;
    PurpleCoin private purpleCoin;

    mapping(address => bool) private accounts;
    address[] address_accounts;

    event AddressAdded(address indexed _address);

    constructor(address _utenteProgettoAddress, address _purpleCoinAddress) {
        utenteProgetto = utente(_utenteProgettoAddress);
        purpleCoin = PurpleCoin(_purpleCoinAddress);

        // Set initial accounts from utenteProgetto
        set_address();

        // Creazione dei 10 gruppi preimpostati
        createGruppo("Sport", "Discussioni su sport e attivita' fisica");
        createGruppo(
            "Programmazione",
            "Tematiche di coding e sviluppo software"
        );
        createGruppo("Musica", "Condividi le tue passioni musicali");
        createGruppo("Cucina", "Ricette e trucchi culinari");
        createGruppo("Viaggi", "Destinazioni e consigli di viaggio");
        createGruppo("Cinema", "Film, serie TV e recensioni");
        createGruppo("Libri", "Discussioni su romanzi e letture interessanti");
        createGruppo("Videogiochi", "Tutto sui videogames e il gaming");
        createGruppo("Fitness", "Allenamenti, diete e consigli per la salute");
        createGruppo("Tecnologia", "Ultime novita' e trend tech");
    }

    modifier only_account_registred() {
        require(accounts[msg.sender], "Account non registrato");
        _;
    }

    modifier only_group_exist(uint256 _id_gruppo) {
        require(_id_gruppo <= 9 && _id_gruppo >= 0, "Il Gruppo non esiste :(");
        _;
    }

    modifier check_length_titolo(string memory _titolo) {
        require(
            bytes(_titolo).length <= 65,
            "Il titolo supera la lunghezza massima di 65 caratteri"
        );
        _;
    }

    modifier check_like() {
        require(!_is_like[msg.sender], "Puoi mettere un like per post");
        _;
    }

    modifier check_id_post(uint256 _id_post) {
        require(
            _id_post >= 0 && _id_post <= count_id_post,
            "Il post non esiste"
        );
        _;
    }

    modifier update_accounts() {
        set_address();
        _;
    }

    function createGruppo(
        string memory nick,
        string memory _descrizione
    ) private {
        Gruppo memory g = Gruppo({
            id_gruppo: count_id_gruppo,
            nick_group: nick,
            descrizione: _descrizione,
            n_like: 0,
            n_post: 0
        });

        gruppi[count_id_gruppo] = g;
        count_id_gruppo++;
    }

    function createPost(
        uint256 _id_gruppo,
        string memory _titolo,
        string memory _descrizione
    )
        public
        only_account_registred
        only_group_exist(_id_gruppo)
        check_length_titolo(_titolo)
        update_accounts
    {
        Post memory post = Post({
            id_gruppo_post: _id_gruppo,
            id_post: count_id_post,
            titolo: _titolo,
            descrizione: _descrizione,
            n_like: 0,
            account: msg.sender,
            rewarded: false
        });

        posts[count_id_post] = post;
        count_id_post++;
    }

    function addLike(
        uint256 _id_post
    )
        public
        only_account_registred
        check_like
        check_id_post(_id_post)
        update_accounts
    {
        posts[_id_post].n_like++;

        // check if per controllare che una volta raggiunti gli n like, il propr. del post riceve il premio di k coin, una sola volta
        if (posts[_id_post].n_like == 3 && !posts[_id_post].rewarded) {
            purpleCoin.mint(
                posts[_id_post].account,
                5 * 10 ** purpleCoin.decimals()
            ); // premio k purplecoin
            posts[_id_post].rewarded = true; // Mark as rewarded
        }
    }

    function create_commento(
        uint256 _id_post,
        string memory _descrizione
    ) public only_account_registred check_id_post(_id_post) update_accounts {
        Commento memory commento = Commento({
            id_post_commento: _id_post,
            descrizione: _descrizione,
            account: msg.sender
        });

        commenti[count_id_commento] = commento;
        count_id_commento++;
    }

    function set_address() private {
        address_accounts = utenteProgetto.get_address();
        uint256 i = 0;

        for (i = 0; i < address_accounts.length; i++) {
            accounts[address_accounts[i]] = true;
            emit AddressAdded(address_accounts[i]);
        }
    }

    function get_address_gruppo() public returns (address[] memory) {
        set_address();
        return address_accounts;
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](count_id_post);
        for (uint256 i = 0; i < count_id_post; i++) {
            allPosts[i] = posts[i];
        }
        return allPosts;
    }
}
