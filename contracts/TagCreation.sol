// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "./PetRecord.sol";
import "./IERC6551Account.sol";
import "./IERC6551Registry.sol";
import "./PetTag.sol";


contract TagCreation is ReentrancyGuard, ERC721Holder {

    PetRecord public PRT;
    PetTag public PET;
    address Registry6551 = 0x002c0c13181038780F552f0eC1B72e8C720147E6;
    address Account6551 = 0x9FFDEb36540e1a12b1F27751508715174122C090;
    uint TagFees = 10; 


    uint tagId = 30000 ;


    struct PetDetails {
        string petName;
        string ownerName;
        string petType;
        address ownerWallet;
        uint tagId;
        address account;
      
    }

    struct EmergencyContact {
        address contact1;
        uint phoneNumber1;
        address contact2;
        uint phoneNumber2;
    }

    struct Token {
        IERC20 tokenAddress;
        uint decimals;
    }

    event NewTag (
        address indexed user,
        uint indexed tagId,
        address indexed account
    );
    
    event NewECAdded (
    
        uint indexed tagId,
        address contact1,
        uint phoneNumber1,
        address contact2,
        uint phoneNumber2
    );

    event NewMedicalHistoryAdded (
    
        uint indexed tagId,
        address indexed user,
        uint indexed medicalid,
        address account

    );

    event NewMemoryAdded (
    
        uint indexed tagId,
        address indexed user,
        uint indexed memoryid,
        address account

    );


    mapping (address => PetDetails ) public users;
    mapping (uint => address) public tagIdMapping;
    mapping(uint => EmergencyContact) public EContacts;
    mapping (string => Token) public tokens;
    mapping( address => mapping( string => uint)) public balance;

    function addPetRecordTokenAddress (address _contractAddress) public {
        PRT = PetRecord(_contractAddress);
    }

    function addPetTagTokenAddress (address _contractAddress) public {
        PET = PetTag(_contractAddress);
    }
    
    function addCurrencies( string memory _currency, address _tokenAddress, uint decimals) public {
        tokens[_currency] = Token(IERC20(_tokenAddress), decimals);
        
    }

    function addUser(string memory _pname, string memory _oname, string memory _ptype, string memory _cid)public  {
        tagId ++;
        
        createPetTag(msg.sender, tagId, _cid);
        address account = createPetTagAccount(tagId);
        users[msg.sender] = PetDetails(_pname, _oname, _ptype, msg.sender, tagId, account);
        tagIdMapping[tagId] = msg.sender;

        emit NewTag(msg.sender,tagId,account);

    }

    function addEmergencyContacts( uint _tagId, address _contact1, uint _phoneNumber1, address _contact2, uint _phoneNumber2, string memory currency) internal {

        require(tagIdMapping[_tagId] == msg.sender, "User doesnt hold the tag ID");
        EContacts[_tagId] = EmergencyContact(_contact1,_phoneNumber1,_contact2,_phoneNumber2);

        IERC20 tokenContract_ = tokens[currency].tokenAddress;

        uint charges = TagFees * 10 **  tokens[currency].decimals;
        require(tokenContract_.balanceOf(msg.sender) > charges, "Insufficient Balance");
        tokenContract_.transferFrom(msg.sender, address(this), charges);
        balance[address(this)][currency] = charges;

        emit NewECAdded(_tagId,_contact1,_phoneNumber1,_contact2,_phoneNumber2);


    }

    function createPetTag(address _user, uint _tagId, string memory _cid ) internal {
        PET.safeMint(_user, _tagId, _cid);

    }

    function createPetTagAccount(uint _tagId) internal returns (address){
        bytes32 salt;
        address account = IERC6551Registry(Registry6551).createAccount(Account6551, salt, block.chainid, address(PET), _tagId);
        return account;

    }

    

    function addDiagnosis (address _user , uint _medicalHistoryId , string memory _uriOfDiagnosis) public {
        require(users[_user].ownerWallet != address(0), "Invalid Pet Id");
        PRT.safeMint(users[_user].ownerWallet, _medicalHistoryId, _uriOfDiagnosis);

        emit NewMedicalHistoryAdded(users[_user].tagId, _user, _medicalHistoryId, users[_user].account);
    }

    function addMemory (address _user , uint _memoryId , string memory _uriOfMemory) public {
        require(users[_user].ownerWallet != address(0), "Invalid Pet Id");
        PRT.safeMint(users[_user].ownerWallet, _memoryId, _uriOfMemory);

        emit NewMedicalHistoryAdded(users[_user].tagId, _user, _memoryId, users[_user].account);
    }


    function updateTokenURI( uint tokenId, string memory URI) public  {
        PRT.setTokenURI(tokenId, URI);
    }


    function withdrawFromContract( string memory _currency ) public  {

        IERC20 tokenContract_ = tokens[_currency].tokenAddress;
        require(tokenContract_.balanceOf(address(this)) > 0, "Insufficient Balance");
        tokenContract_.transfer(msg.sender,  balance[address(this)][_currency]);
        balance[address(this)][_currency]=0;

    }

    


}