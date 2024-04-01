 export const tagContractAddress ='0x5d53A22017bb4534c0618fBF172A09C667c3F814'

 export const tagContractABI = ['function addUser(string memory _pname, string memory _oname, string memory _ptype, string memory _cid) public',
'function addDiagnosis (address _user , uint _medicalHistoryId , string memory _uriOfDiagnosis) public',
'function addMemory (address _user , uint _memoryId , string memory _uriOfMemory) public',
'function updateTokenURI( uint tokenId, string memory URI) public',
'event NewTag (address indexed user,uint indexed tagId, address indexed account)',
 'event NewECAdded (uint indexed tagId,address contact1,uint phoneNumber1,address contact2,uint phoneNumber2)',
 'event NewMedicalHistoryAdded (uint indexed tagId,address indexed user,uint indexed medicalid,address account)',
  'event NewMemoryAdded (uint indexed tagId,address indexed user,uint indexed memoryid,address account)'
]


export const USDCAddress = "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2";
export const USDCABI = [
  // 'function transfer(address to, uint256 amount) external returns (bool)',
  "function approve(address spender, uint256 amount) public",
];


//PET TAG 0x0C5010150461d2640052E1d2e5BfaFf3701278d6
//PET Record 0x898F4b52A4F98dCE12E895B8894177d75d571A0C