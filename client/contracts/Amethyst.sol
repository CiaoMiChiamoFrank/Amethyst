// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;
import "./Purplecoin.sol";

contract Amethyst {
    
    //--------------------------------------UTENTE-----------------------------------------------------
    struct Utente {
        address id;
        string nick_name;
    }

    mapping(address => Utente) private accounts;
    mapping(address => bool) private accounts_created;
    address[] private nick_name_used;
    PurpleCoin private purpleCoin;


    constructor( address _purpleCoinAddress) {
        purpleCoin = PurpleCoin(_purpleCoinAddress);

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

    //Check per verificare se il nick name è già in uso
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

    //Check per verificare che l'utente ha già creato l'account
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

    function get_nickname_address () public view returns (string memory){
        string memory _nick_name = accounts[msg.sender].nick_name;
        return _nick_name;
    }

    //----------------------END-UTENTE------------------------------------------------------------

    //---------------------------------GRUPPO-----------------------------------------------------
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
        string account;
        bool rewarded;
        address _sender;
    }

    struct Commento {
        uint256 id_post_commento;
        string descrizione;
        string account;
    }

    uint256 private count_id_gruppo = 0;
    uint256 private count_id_post = 0;
    uint256 private count_id_commento = 0;
    mapping(uint256 => Gruppo) private gruppi;
    mapping(uint256 => Post) private posts;
    mapping(uint256 => Commento) private commenti;

    //Approccio creato da chatGPT, non ci sarei mai arrivato che si potesse creare un doppio mapping in solidity
    //Penso che prima o poi mi ruberai il lavoro
    //questo giorno non è molto lontano
    // Aggiungi un mapping per memorizzare i like per utente e post
    mapping(address => mapping(uint256 => bool)) private userLikes; // mapping(address => mapping(postId => bool))

    modifier only_account_registred() {
        require(accounts_created[msg.sender], "Account non registrato");
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

    modifier check_like(uint256 _id_post) {
        require(!userLikes[msg.sender][_id_post], "Hai gia' messo like a questo post.");
        _; // Continua con la funzione se il controllo passa
    }

    modifier check_id_post(uint256 _id_post) {
        require(
            _id_post >= 0 && _id_post <= count_id_post,
            "Il post non esiste"
        );
        _;
    }

    // Modifier che verifica se il mittente è l'autore del post
    modifier only_post_author(uint256 _id_post) {
        require(posts[_id_post]._sender == msg.sender, "Solo l autore del post puo eliminarlo");
            _;
    }

    function createGruppo( string memory nick, string memory _descrizione) private {
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

    function createPost( uint256 _id_gruppo, string memory _titolo, string memory _descrizione) public only_account_registred only_group_exist(_id_gruppo) check_length_titolo(_titolo) {
        Post memory post = Post({
            id_gruppo_post: _id_gruppo,
            id_post: count_id_post,
            titolo: _titolo,
            descrizione: _descrizione,
            n_like: 0,
            account: get_nickname_address(),
            rewarded: false,
            _sender: msg.sender
        });

        gruppi[_id_gruppo].n_post ++;
        posts[count_id_post] = post;
        count_id_post++;
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](count_id_post);
        for (uint256 i = 0; i < count_id_post; i++) {
            allPosts[i] = posts[i];
        }
        return allPosts;
    }

    //RESTITUZIONI TUTTI NOMI DEI GRUPPI
    function getGruppi() public view returns (Gruppo[] memory) {
        Gruppo[] memory allGruppi = new Gruppo[](count_id_gruppo);
        
        for (uint256 i = 0; i < count_id_gruppo; i++) {
            allGruppi[i] = gruppi[i];
        }
        
        return allGruppi;
    }

    //RESTITUZIONI gruppo in base ad ID
    function getGruppId(uint256 _id) public view returns (Gruppo memory) {
        return gruppi[_id];
    }

    ///////////////////////
    //Restituzione dei post di uno specifico gruppo
    function getPost(uint256 _id_gruppo) public view only_group_exist(_id_gruppo) returns (Post[] memory) {
        // Conta quanti post appartengono al gruppo specificato così facendo possiamo creare un array di quella dimensione
        uint256 count = 0;
        for (uint256 i = 0; i < count_id_post; i++) {
            if (posts[i].id_gruppo_post == _id_gruppo) {
                count++;
                //ciao
            }
        }
        // Crea un array per memorizzare i post
        Post[] memory groupPosts = new Post[](count); //count viene sfruttato così
        uint256 index = 0;

        // Riempi l'array con i post corrispondenti
        for (uint256 i = 0; i < count_id_post; i++) {
            if (posts[i].id_gruppo_post == _id_gruppo) {
                groupPosts[index] = posts[i];
                index++;
            }
        }

        return groupPosts;
    }

    //Restituzione like di uno specifico gruppo
    function getLike(uint256 _id_gruppo) public view only_account_registred only_group_exist(_id_gruppo) returns (uint256) {
        return gruppi[_id_gruppo].n_like;
    }

    //Aggiunta like
    function addLike(uint256 _id_post) public only_account_registred check_like(_id_post) check_id_post(_id_post) {
        posts[_id_post].n_like++;
        
        //quando aggiungiamo un like aggiorniamo anche i like dei gruppi
        uint256 _id_gruppo = posts[_id_post].id_gruppo_post;
        gruppi[_id_gruppo].n_like++;

        // Segna che l'utente ha messo like a questo post
        userLikes[msg.sender][_id_post] = true;

        // check if per controllare che una volta raggiunti gli n like, il propr. del post riceve il premio di k coin, una sola volta
        if (posts[_id_post].n_like == 3 && !posts[_id_post].rewarded) {
            purpleCoin.mint(
                posts[_id_post]._sender,
                5 * 10 ** purpleCoin.decimals()
            ); // premio k purplecoin
            posts[_id_post].rewarded = true; // Mark as rewarded
        }
    }

    //creazione commento
    function create_commento( uint256 _id_post, string memory _descrizione) public only_account_registred check_id_post(_id_post)  {
        Commento memory commento = Commento({
            id_post_commento: _id_post,
            descrizione: _descrizione,
            account: get_nickname_address()
        });

        commenti[count_id_commento] = commento;
        count_id_commento++;
    }

    // Funzione che ci permette di verificare quanti commenti appartengono ad un post
    function getCommenti(uint256 _id_post) public view check_id_post(_id_post) returns (Commento[] memory) {
        // Conta quanti commenti appartengono al post specificato
        uint256 count = 0;
        for (uint256 i = 0; i < count_id_commento; i++) {
         if (commenti[i].id_post_commento == _id_post) {
              count++;
            }
        }

        // Crea un array per memorizzare i commenti
        Commento[] memory postCommenti = new Commento[](count);
        uint256 index = 0;

        // Riempi l'array con i commenti corrispondenti
        for (uint256 i = 0; i < count_id_commento; i++) {
            if (commenti[i].id_post_commento == _id_post) {
                postCommenti[index] = commenti[i];
                index++;
            }
        }

        return postCommenti;
    }

    // Funzione per eliminare un post
    function deletePost(uint256 _id_post) public only_post_author(_id_post) check_id_post(_id_post) {
        uint256 groupId = posts[_id_post].id_gruppo_post;
        uint256 n_like_post = posts[_id_post].n_like;

        gruppi[groupId].n_like = gruppi[groupId].n_like - n_like_post;
        gruppi[groupId].n_post--;
        
        delete posts[_id_post];
    }
    
    
}   