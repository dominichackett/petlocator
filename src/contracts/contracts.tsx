 export const tagContractAddress ='0x9E4EF80eAcC641B1CC55208BFf6b997deb87826E'

 export const tagContractABI = ['function addUser(string memory _pname, string memory _oname, string memory _ptype, string memory _cid) public',
'function addDiagnosis (address _user , uint _medicalHistoryId , string memory _uriOfDiagnosis) public',
'function addMemory (address _user , uint _memoryId , string memory _uriOfMemory) public',
'function updateTokenURI( uint tokenId, string memory URI) public',
'function addEmergencyContacts( uint _tagId, address _contact1, uint _phoneNumber1, address _contact2, uint _phoneNumber2, string memory currency) internal',
'event NewTag (address indexed user,uint indexed tagId, address indexed account)',
 'event NewECAdded (uint indexed tagId,address contact1,uint phoneNumber1,address contact2,uint phoneNumber2)',
 'event NewMedicalHistoryAdded (uint indexed tagId,address indexed user,uint indexed medicalid,address account',
  'event NewMemoryAdded (uint indexed tagId,address indexed user,uint indexed memoryid,address account)'
]


export const USDCAddress = "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2";
export const USDCABI = [
  // 'function transfer(address to, uint256 amount) external returns (bool)',
  "function approve(address spender, uint256 amount) public",
];
